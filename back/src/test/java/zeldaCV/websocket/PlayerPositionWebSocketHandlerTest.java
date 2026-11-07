package zeldaCV.websocket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

class PlayerPositionWebSocketHandlerTest {

    @Nested
    class DisplayablePseudo {

        @Test
        void keepsAnOrdinaryPseudoTrimmed() {
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo("  Link  ")).isEqualTo("Link");
        }

        @Test
        void emptyOrMissingPseudoMeansNoName() {
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo(null)).isEmpty();
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo("   ")).isEmpty();
        }

        @Test
        void cutsTooLongPseudos() {
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo("a".repeat(100))).hasSize(20);
        }

        @Test
        void dropsForbiddenPseudosToPreventImpersonation() {
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo("Admin")).isEmpty();
            assertThat(PlayerPositionWebSocketHandler.displayablePseudo("Quentin")).isEmpty();
        }
    }

    @Nested
    class Broadcast {

        private final JsonMapper json = JsonMapper.builder().build();

        private WebSocketSession session(String id) {
            WebSocketSession session = mock(WebSocketSession.class);
            when(session.getId()).thenReturn(id);
            when(session.isOpen()).thenReturn(true);
            return session;
        }

        private static TextMessage position(String uuid, String pseudo) {
            return new TextMessage("{\"uuid\":\"" + uuid + "\",\"pseudo\":\"" + pseudo
                    + "\",\"x\":1,\"y\":1,\"scene\":\"sceneWorld\"}");
        }

        /** Regression: with more than 10 named players, the broadcast used to throw (negative limit). */
        @Test
        void manyNamedPlayersAreAllBroadcast() throws Exception {
            PlayerPositionWebSocketHandler handler = new PlayerPositionWebSocketHandler();
            List<WebSocketSession> sessions = new ArrayList<>();
            for (int i = 0; i < 15; i++) {
                WebSocketSession session = session("s" + i);
                sessions.add(session);
                handler.afterConnectionEstablished(session);
                // the last 3 players have no pseudo
                handler.handleTextMessage(session, position("p" + i, i < 12 ? "Player" + i : ""));
            }

            handler.broadcastTopPlayers();

            ArgumentCaptor<TextMessage> sent = ArgumentCaptor.forClass(TextMessage.class);
            verify(sessions.get(0), times(1)).sendMessage(sent.capture());
            JsonNode players = json.readTree(sent.getValue().getPayload()).get("players");
            assertThat(players).hasSize(14);
            for (WebSocketSession session : sessions) {
                verify(session, times(1)).sendMessage(any());
            }
        }

        @Test
        void forbiddenPseudoIsBroadcastWithoutName() throws Exception {
            PlayerPositionWebSocketHandler handler = new PlayerPositionWebSocketHandler();
            WebSocketSession viewer = session("viewer");
            WebSocketSession impostor = session("impostor");
            handler.afterConnectionEstablished(viewer);
            handler.afterConnectionEstablished(impostor);
            handler.handleTextMessage(viewer, position("v", "Link"));
            handler.handleTextMessage(impostor, position("i", "admin"));

            handler.broadcastTopPlayers();

            ArgumentCaptor<TextMessage> sent = ArgumentCaptor.forClass(TextMessage.class);
            verify(viewer).sendMessage(sent.capture());
            JsonNode player = json.readTree(sent.getValue().getPayload()).get("players").get(0);
            assertThat(player.get("uuid").asString()).isEqualTo("i");
            assertThat(player.get("pseudo").asString()).isEmpty();
        }

        @Test
        void onlyTheRefusedPlayerIsToldItsPseudoWasRejected() throws Exception {
            PlayerPositionWebSocketHandler handler = new PlayerPositionWebSocketHandler();
            WebSocketSession viewer = session("viewer");
            WebSocketSession impostor = session("impostor");
            handler.afterConnectionEstablished(viewer);
            handler.afterConnectionEstablished(impostor);
            handler.handleTextMessage(viewer, position("v", "Link"));
            handler.handleTextMessage(impostor, position("i", " admin "));

            handler.broadcastTopPlayers();

            assertThat(rejectedPseudoSentTo(viewer)).isNull();
            assertThat(rejectedPseudoSentTo(impostor)).isEqualTo("admin");

            // the player picks another pseudo: the error goes away
            handler.handleTextMessage(impostor, position("i", "Marin"));
            handler.broadcastTopPlayers();
            assertThat(rejectedPseudoSentTo(impostor)).isNull();
        }

        private String rejectedPseudoSentTo(WebSocketSession session) throws Exception {
            ArgumentCaptor<TextMessage> sent = ArgumentCaptor.forClass(TextMessage.class);
            verify(session, org.mockito.Mockito.atLeastOnce()).sendMessage(sent.capture());
            JsonNode rejected = json.readTree(sent.getValue().getPayload()).get("rejectedPseudo");
            return rejected == null || rejected.isNull() ? null : rejected.asString();
        }
    }
}
