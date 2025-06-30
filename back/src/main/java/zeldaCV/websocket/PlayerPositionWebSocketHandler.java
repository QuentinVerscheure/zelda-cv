package zeldaCV.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import zeldaCV.websocket.dto.PlayerPositionDTO;
import zeldaCV.websocket.dto.TopPlayersDTO;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class PlayerPositionWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, PlayerPositionDTO> playerPositions = new ConcurrentHashMap<>();
    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(@org.springframework.lang.NonNull WebSocketSession session) {
        sessions.add(session);
        System.out.println("[WebSocket] New connection: sessionId=" + session.getId() + " | total=" + sessions.size());
    }

    @Override
    public void afterConnectionClosed(@org.springframework.lang.NonNull WebSocketSession session,
            @org.springframework.lang.NonNull CloseStatus status) {
        sessions.remove(session);
        playerPositions.remove(session.getId());
        System.out.println("[WebSocket] Connection closed: sessionId=" + session.getId() + " | total=" + sessions.size());
    }

    @Override
    protected void handleTextMessage(@org.springframework.lang.NonNull WebSocketSession session,
            @org.springframework.lang.NonNull TextMessage message) throws Exception {
        PlayerPositionDTO playerPosition;
        try {
            playerPosition = objectMapper.readValue(message.getPayload(), PlayerPositionDTO.class);
            playerPositions.put(session.getId(), playerPosition);
        } catch (Exception e) {
            System.err.println("[WebSocket] Error parsing message from sessionId=" + session.getId() + ": " + e.getMessage());
            e.printStackTrace();
            return;
        }
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
                    .limit(10 - result.size())
                    .forEach(result::add);
            }

            TopPlayersDTO topPlayersDTO = new TopPlayersDTO(result);

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
