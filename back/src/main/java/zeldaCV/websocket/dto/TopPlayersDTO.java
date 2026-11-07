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

    /** Pseudo of the receiving player refused by the server (forbidden), null when accepted. */
    private String rejectedPseudo;
}
