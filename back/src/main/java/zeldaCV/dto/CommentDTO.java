package zeldaCV.dto;

import java.time.Instant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * A guestbook message as returned by the API. Never contains the edit password (nor its hash).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(description = "A guestbook message as returned by the API")
public class CommentDTO {
    private Long id;
    private String comment;
    private int coordinateX;
    private int coordinateY;
    @Schema(description = "Pseudo of the author")
    private String userPseudo;
    @Schema(description = "Creation date (UTC)")
    private Instant date;
}
