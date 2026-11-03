package zeldaCV.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import zeldaCV.util.CommentRules;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Password of a guestbook message")
public class CommentPasswordDTO {

    @NotNull(message = "Le mot de passe est obligatoire")
    @Pattern(regexp = CommentRules.PASSWORD_PATTERN, message = CommentRules.PASSWORD_PATTERN_MESSAGE)
    @Schema(example = "q3Jf0c1x9V7mKkZb2Yw8uT4sR6pN5oLhGdEaCiBjQ0M")
    private String password;
}
