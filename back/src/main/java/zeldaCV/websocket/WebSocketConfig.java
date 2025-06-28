package zeldaCV.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final PlayerPositionWebSocketHandler playerPositionWebSocketHandler;

    public WebSocketConfig(PlayerPositionWebSocketHandler playerPositionWebSocketHandler) {
        this.playerPositionWebSocketHandler = playerPositionWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
        registry.addHandler(playerPositionWebSocketHandler, "/ws/positions").setAllowedOrigins("*");
    }
}
