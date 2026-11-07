package zeldaCV.websocket;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import zeldaCV.websocket.dto.PlayerPositionDTO;
import tools.jackson.databind.json.JsonMapper;
import zeldaCV.websocket.dto.TopPlayersDTO;
import zeldaCV.util.CommentRules;
import zeldaCV.util.Pseudo;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class PlayerPositionWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, PlayerPositionDTO> playerPositions = new ConcurrentHashMap<>();
    // pseudo refused for a session (forbidden), sent back to that player only
    private final Map<String, String> rejectedPseudos = new ConcurrentHashMap<>();
    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final JsonMapper objectMapper = JsonMapper.builder().build();

    @Override
    public void afterConnectionEstablished(@org.jspecify.annotations.NonNull WebSocketSession session) {
        sessions.add(session);
        System.out.println("[WebSocket] New connection: sessionId=" + session.getId() + " | total=" + sessions.size());
    }

    @Override
    public void afterConnectionClosed(@org.jspecify.annotations.NonNull WebSocketSession session,
            @org.jspecify.annotations.NonNull CloseStatus status) {
        sessions.remove(session);
        playerPositions.remove(session.getId());
        rejectedPseudos.remove(session.getId());
        System.out.println("[WebSocket] Connection closed: sessionId=" + session.getId() + " | total=" + sessions.size());
    }

    @Override
    protected void handleTextMessage(@org.jspecify.annotations.NonNull WebSocketSession session,
            @org.jspecify.annotations.NonNull TextMessage message) throws Exception {
        PlayerPositionDTO playerPosition;
        try {
            playerPosition = objectMapper.readValue(message.getPayload(), PlayerPositionDTO.class);
            String requested = playerPosition.getPseudo() == null ? "" : playerPosition.getPseudo().strip();
            String displayed = displayablePseudo(requested);
            playerPosition.setPseudo(displayed);
            playerPositions.put(session.getId(), playerPosition);
            // tell the player its pseudo was refused, so the menu can show an error
            if (!requested.isEmpty() && displayed.isEmpty()) {
                rejectedPseudos.put(session.getId(), requested);
            } else {
                rejectedPseudos.remove(session.getId());
            }
        } catch (Exception e) {
            System.err.println("[WebSocket] Error parsing message from sessionId=" + session.getId() + ": " + e.getMessage());
            e.printStackTrace();
            return;
        }
    }

    /**
     * The pseudo is shown above the player to every visitor of the scene, so it follows the same
     * rules as a guestbook pseudo: limited length, and no impersonation (forbidden pseudos are
     * dropped, the player is then displayed without a name).
     */
    static String displayablePseudo(String pseudo) {
        if (pseudo == null) {
            return "";
        }
        String trimmed = pseudo.strip();
        if (trimmed.length() > CommentRules.PSEUDO_MAX_LENGTH) {
            trimmed = trimmed.substring(0, CommentRules.PSEUDO_MAX_LENGTH).strip();
        }
        return Pseudo.isForbidden(trimmed) ? "" : trimmed;
    }

    // Send updated positions of top50 players to all clients at a fixed interval
    @Scheduled(fixedRate = 200)
    public void broadcastTopPlayers() {
        for (WebSocketSession session : sessions) {
            if (!session.isOpen()) continue;
            PlayerPositionDTO currentPlayer = playerPositions.get(session.getId());
            if (currentPlayer == null) continue;

            String currentScene = currentPlayer.getScene();

            // First pass: collect up to 50 players with pseudo
            List<PlayerPositionDTO> result = new ArrayList<>(50);
            playerPositions.entrySet().stream()
                .filter(entry -> !entry.getKey().equals(session.getId()))
                .map(Map.Entry::getValue)
                .filter(p -> Objects.equals(p.getScene(), currentScene))
                .filter(p -> p.getPseudo() != null && !p.getPseudo().isEmpty())
                .limit(50)
                .forEach(result::add);

            // Second pass: if less than 50, complete with others (no pseudo)
            if (result.size() < 50) {
                playerPositions.entrySet().stream()
                    .filter(entry -> !entry.getKey().equals(session.getId()))
                    .map(Map.Entry::getValue)
                    .filter(p -> Objects.equals(p.getScene(), currentScene))
                    .filter(p -> p.getPseudo() == null || p.getPseudo().isEmpty())
                    .limit(50 - result.size())
                    .forEach(result::add);
            }

            TopPlayersDTO topPlayersDTO = new TopPlayersDTO(result, rejectedPseudos.get(session.getId()));

            try {
                String json = objectMapper.writeValueAsString(topPlayersDTO);
                session.sendMessage(new TextMessage(json));
            } catch (Exception e) {
                System.err.println("[WebSocket] Error sending to sessionId=" + session.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
