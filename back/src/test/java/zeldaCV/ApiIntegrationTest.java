package zeldaCV;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.WebSocket;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import zeldaCV.dto.MailDTO;
import zeldaCV.service.MailService;

/**
 * Starts the whole application against a real, throwaway MySQL (Docker, via Testcontainers) and
 * calls it over HTTP like the browser does. The Flyway migrations run on an empty database, so
 * this also checks that the schema matches the entities.
 *
 * The per-IP rate limit is shared by the whole test run: each test uses its own fake client IP
 * (X-Forwarded-For, trusted from 127.0.0.1) so tests don't eat each other's quota.
 */
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "app.cors.allowed-origin=" + ApiIntegrationTest.FRONT_ORIGIN)
class ApiIntegrationTest {

    static final String FRONT_ORIGIN = "https://front.example.test";
    private static final String PASSWORD = "q3Jf0c1x9V7mKkZb2Yw8uT4sR6pN5oLhGdEaCiBjQ0M";
    private static final String OTHER_PASSWORD = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    private static final AtomicInteger NEXT_IP = new AtomicInteger(1);
    private static final AtomicInteger NEXT_SPOT = new AtomicInteger(0);

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.0");

    @MockitoBean
    MailService mailService;

    @LocalServerPort
    int port;

    private final HttpClient http = HttpClient.newHttpClient();
    private final JsonMapper json = JsonMapper.builder().build();
    private final String clientIp = "203.0.113." + NEXT_IP.getAndIncrement();

    // ---- helpers ---------------------------------------------------------------------------

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .header("X-Forwarded-For", clientIp)
                .timeout(Duration.ofSeconds(10));
    }

    private HttpResponse<String> send(HttpRequest.Builder builder) throws Exception {
        return http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> get(String path) throws Exception {
        return send(request(path).GET());
    }

    private HttpResponse<String> post(String path, String body) throws Exception {
        return send(request(path).header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body)));
    }

    private HttpResponse<String> put(String path, String body) throws Exception {
        return send(request(path).header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(body)));
    }

    private HttpResponse<String> delete(String path, String password) throws Exception {
        return send(request(path).header("X-Comment-Password", password).DELETE());
    }

    private JsonNode body(HttpResponse<String> response) {
        return json.readTree(response.body());
    }

    /** A free spot on the wall, different for each message so they never overlap. */
    private static int[] freeSpot() {
        int index = NEXT_SPOT.getAndIncrement();
        return new int[] { 400, 300 + index * 60 };
    }

    private String commentJson(String pseudo, String text, int[] spot, String password) {
        return json.writeValueAsString(java.util.Map.of(
                "pseudo", pseudo, "comment", text,
                "coordinateX", spot[0], "coordinateY", spot[1], "password", password));
    }

    private long createComment(String pseudo, String text, int[] spot) throws Exception {
        HttpResponse<String> response = post("/api/comments", commentJson(pseudo, text, spot, PASSWORD));
        assertThat(response.statusCode()).as(response.body()).isEqualTo(201);
        return body(response).get("id").asLong();
    }

    private static void assertErrorFormat(HttpResponse<String> response, int status, JsonNode body) {
        assertThat(response.statusCode()).isEqualTo(status);
        assertThat(body.get("status").asInt()).isEqualTo(status);
        assertThat(body.get("error").asString()).isNotBlank();
        assertThat(body.get("timestamp").asString()).endsWith("Z");
    }

    // ---- tests -----------------------------------------------------------------------------

    @Nested
    class Guestbook {

        @Test
        void fullLifecycleCreateVerifyUpdateDelete() throws Exception {
            int[] spot = freeSpot();
            long id = createComment("Link", "Bonjour depuis les tests", spot);

            HttpResponse<String> list = get("/api/comments");
            assertThat(list.statusCode()).isEqualTo(200);
            assertThat(list.body()).contains("Bonjour depuis les tests");

            HttpResponse<String> verifyOk = post("/api/comments/" + id + "/verify", "{\"password\":\"" + PASSWORD + "\"}");
            assertThat(body(verifyOk).get("valid").asBoolean()).isTrue();
            HttpResponse<String> verifyKo = post("/api/comments/" + id + "/verify", "{\"password\":\"" + OTHER_PASSWORD + "\"}");
            assertThat(body(verifyKo).get("valid").asBoolean()).isFalse();

            HttpResponse<String> updated = put("/api/comments/" + id,
                    "{\"comment\":\"Texte modifié\",\"coordinateX\":" + spot[0] + ",\"coordinateY\":" + spot[1]
                            + ",\"password\":\"" + PASSWORD + "\"}");
            assertThat(updated.statusCode()).as(updated.body()).isEqualTo(200);
            assertThat(body(updated).get("comment").asString()).isEqualTo("Texte modifié");

            HttpResponse<String> deleted = delete("/api/comments/" + id, PASSWORD);
            assertThat(deleted.statusCode()).isEqualTo(204);
            assertThat(get("/api/comments").body()).doesNotContain("Texte modifié");
        }

        @Test
        void theApiNeverExposesThePasswordOrItsHash() throws Exception {
            createComment("Zelda", "Secret bien gardé", freeSpot());
            String list = get("/api/comments").body().toLowerCase();
            assertThat(list).doesNotContain("password").doesNotContain("hash").doesNotContain(PASSWORD.toLowerCase());
        }

        @Test
        void wrongPasswordCannotEditOrDelete() throws Exception {
            int[] spot = freeSpot();
            long id = createComment("Marin", "Pas touche", spot);

            HttpResponse<String> update = put("/api/comments/" + id,
                    "{\"comment\":\"Piraté\",\"coordinateX\":" + spot[0] + ",\"coordinateY\":" + spot[1]
                            + ",\"password\":\"" + OTHER_PASSWORD + "\"}");
            assertErrorFormat(update, 403, body(update));

            HttpResponse<String> delete = delete("/api/comments/" + id, OTHER_PASSWORD);
            assertErrorFormat(delete, 403, body(delete));

            assertThat(get("/api/comments").body()).contains("Pas touche");
        }

        @Test
        void unknownMessageIs404() throws Exception {
            HttpResponse<String> response = post("/api/comments/999999/verify", "{\"password\":\"" + PASSWORD + "\"}");
            assertErrorFormat(response, 404, body(response));
        }

        @Test
        void overlappingMessagesAreRejected() throws Exception {
            int[] spot = freeSpot();
            createComment("Tarin", "Premier arrivé", spot);
            HttpResponse<String> response = post("/api/comments",
                    commentJson("Richard", "Juste dessus", new int[] { spot[0] + 10, spot[1] + 10 }, PASSWORD));
            assertErrorFormat(response, 400, body(response));
        }
    }

    @Nested
    class Validation {

        @Test
        void pseudoLongerThan20CharsIsRejectedWithAReadableMessage() throws Exception {
            HttpResponse<String> response = post("/api/comments",
                    commentJson("Un pseudo beaucoup trop long", "Bonjour", freeSpot(), PASSWORD));
            assertErrorFormat(response, 400, body(response));
            assertThat(body(response).get("error").asString()).contains("pseudo");
        }

        @Test
        void messageLongerThan250CharsIsRejected() throws Exception {
            HttpResponse<String> response = post("/api/comments",
                    commentJson("Link", "x".repeat(251), freeSpot(), PASSWORD));
            assertErrorFormat(response, 400, body(response));
        }

        @Test
        void passwordMustMatchTheExpectedFormat() throws Exception {
            HttpResponse<String> response = post("/api/comments",
                    commentJson("Link", "Bonjour", freeSpot(), "trop-court"));
            assertErrorFormat(response, 400, body(response));
            assertThat(body(response).get("error").asString()).isEqualTo("Mot de passe invalide");
        }

        @Test
        void forbiddenPseudoIsRejected() throws Exception {
            HttpResponse<String> response = post("/api/comments",
                    commentJson("Quentin Verscheure", "Usurpation", freeSpot(), PASSWORD));
            assertErrorFormat(response, 400, body(response));
        }

        @Test
        void malformedJsonIsA400NotA500() throws Exception {
            HttpResponse<String> response = post("/api/comments", "{oops");
            assertErrorFormat(response, 400, body(response));
        }

        @Test
        void deleteWithoutPasswordHeaderIsA400() throws Exception {
            HttpResponse<String> response = send(request("/api/comments/1").DELETE());
            assertErrorFormat(response, 400, body(response));
        }

        @Test
        void unknownRouteKeepsItsRealStatus() throws Exception {
            HttpResponse<String> response = get("/api/does-not-exist");
            assertErrorFormat(response, 404, body(response));
        }
    }

    @Nested
    class RateLimit {

        @Test
        void sixthCreationInTheHourFromTheSameIpIsRefused() throws Exception {
            // invalid bodies: they still count, and nothing is written to the database
            for (int i = 0; i < 5; i++) {
                assertThat(post("/api/comments", "{oops").statusCode()).isEqualTo(400);
            }
            HttpResponse<String> blocked = post("/api/comments", "{oops");
            assertErrorFormat(blocked, 429, body(blocked));
            assertThat(blocked.headers().firstValue("Retry-After")).hasValue("3600");
        }

        @Test
        void theLimitIsPerClientIpAsSentByTheReverseProxy() throws Exception {
            for (int i = 0; i < 6; i++) {
                post("/api/comments", "{oops");
            }
            HttpResponse<String> otherVisitor = send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/comments"))
                    .header("X-Forwarded-For", "198.51.100.77")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{oops")));
            assertThat(otherVisitor.statusCode()).isEqualTo(400);
        }

        @Test
        void readingIsNeverRateLimited() throws Exception {
            for (int i = 0; i < 10; i++) {
                assertThat(get("/api/comments").statusCode()).isEqualTo(200);
            }
        }
    }

    @Nested
    class Mail {

        @Test
        void validMailIsSent() throws Exception {
            HttpResponse<String> response = post("/api/sendMailToOwner/",
                    "{\"from\":\"visiteur@example.test\",\"subject\":\"Bonjour\",\"text\":\"Super site\"}");
            assertThat(response.statusCode()).as(response.body()).isEqualTo(200);
            verify(mailService).sendMail(any(MailDTO.class));
        }

        @Test
        void incompleteMailIsRejectedAndNotSent() throws Exception {
            HttpResponse<String> response = post("/api/sendMailToOwner/", "{\"from\":\"visiteur@example.test\",\"subject\":\"\"}");
            assertErrorFormat(response, 400, body(response));
            verify(mailService, never()).sendMail(any());
        }
    }

    @Nested
    class Cors {

        private HttpResponse<String> preflight(String origin, String method, String headers) throws Exception {
            return send(request("/api/comments/1")
                    .header("Origin", origin)
                    .header("Access-Control-Request-Method", method)
                    .header("Access-Control-Request-Headers", headers)
                    .method("OPTIONS", HttpRequest.BodyPublishers.noBody()));
        }

        @Test
        void theFrontendOriginMayDeleteWithThePasswordHeader() throws Exception {
            HttpResponse<String> response = preflight(FRONT_ORIGIN, "DELETE", "x-comment-password");
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(response.headers().firstValue("Access-Control-Allow-Origin")).hasValue(FRONT_ORIGIN);
        }

        @Test
        void anotherWebsiteIsRefused() throws Exception {
            HttpResponse<String> response = preflight("https://evil.example.test", "DELETE", "x-comment-password");
            assertThat(response.statusCode()).isEqualTo(403);
            assertThat(response.headers().firstValue("Access-Control-Allow-Origin")).isEmpty();
        }

        @Test
        void headersOutsideTheAllowListAreRefused() throws Exception {
            HttpResponse<String> response = preflight(FRONT_ORIGIN, "POST", "x-something-else");
            assertThat(response.statusCode()).isEqualTo(403);
        }
    }

    @Nested
    class Infrastructure {

        @Test
        void healthIsUp() throws Exception {
            HttpResponse<String> response = get("/actuator/health");
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(body(response).get("status").asString()).isEqualTo("UP");
        }

        @Test
        void openApiDocumentationIsPublished() throws Exception {
            HttpResponse<String> response = get("/v3/api-docs");
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(response.body()).contains("/api/comments");
        }
    }

    @Nested
    class Multiplayer {

        /** Collects the first text frame received. */
        private static final class FirstMessage implements WebSocket.Listener {
            final CompletableFuture<String> message = new CompletableFuture<>();
            private final StringBuilder buffer = new StringBuilder();

            @Override
            public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
                buffer.append(data);
                if (last) {
                    message.complete(buffer.toString());
                }
                webSocket.request(1);
                return null;
            }
        }

        private WebSocket connect(WebSocket.Listener listener) {
            return http.newWebSocketBuilder()
                    .buildAsync(URI.create("ws://localhost:" + port + "/ws/positions"), listener)
                    .join();
        }

        private static String position(String uuid, String scene, int x) {
            return "{\"uuid\":\"" + uuid + "\",\"pseudo\":\"\",\"x\":" + x + ",\"y\":10,\"scene\":\"" + scene + "\"}";
        }

        @Test
        void playersInTheSameSceneSeeEachOtherButNotThemselvesNorOtherScenes() throws Exception {
            FirstMessage aListener = new FirstMessage();
            WebSocket a = connect(aListener);
            WebSocket b = connect(new FirstMessage());
            WebSocket c = connect(new FirstMessage());

            a.sendText(position("player-A", "sceneTest", 100), true).join();
            b.sendText(position("player-B", "sceneTest", 200), true).join();
            c.sendText(position("player-C", "sceneOther", 300), true).join();

            // positions are broadcast on a 200 ms tick
            JsonNode received = json.readTree(aListener.message.get(5, TimeUnit.SECONDS));
            String players = received.get("players").toString();
            assertThat(players).contains("player-B").doesNotContain("player-A").doesNotContain("player-C");

            for (WebSocket socket : new WebSocket[] { a, b, c }) {
                socket.sendClose(WebSocket.NORMAL_CLOSURE, "done").join();
            }
        }
    }
}
