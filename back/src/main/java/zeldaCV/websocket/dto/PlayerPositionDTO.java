package zeldaCV.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerPositionDTO {
    private String pseudo;
    private double x;
    private double y;
    private String scene; 
}
