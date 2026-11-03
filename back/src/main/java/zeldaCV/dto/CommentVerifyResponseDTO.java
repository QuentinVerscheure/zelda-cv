package zeldaCV.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Whether a password currently allows editing a message")
public class CommentVerifyResponseDTO {
    @Schema(description = "true if the password matches the message and its edit window is still open")
    private boolean valid;
}
