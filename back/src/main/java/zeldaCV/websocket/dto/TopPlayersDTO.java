package zeldaCV.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopPlayersDTO {
    private List<PlayerPositionDTO> players;


    public void setPlayers(List<PlayerPositionDTO> players) {
        this.players = players;
    }
}
