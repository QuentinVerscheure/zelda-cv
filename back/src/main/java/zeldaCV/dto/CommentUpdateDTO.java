package zeldaCV.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import zeldaCV.util.CommentRules;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Update of a guestbook message (text and/or position), authorized by its password")
public class CommentUpdateDTO {

    @NotBlank(message = "Le message est obligatoire")
    @Size(max = CommentRules.COMMENT_MAX_LENGTH, message = "Le message ne doit pas dépasser " + CommentRules.COMMENT_MAX_LENGTH + " caractères")
    @Schema(example = "Super portfolio, bravo !")
    private String comment;

    @NotNull(message = "La coordonnée X est obligatoire")
    @Schema(example = "300")
    private Integer coordinateX;

    @NotNull(message = "La coordonnée Y est obligatoire")
    @Schema(example = "250")
    private Integer coordinateY;

    @NotNull(message = "Le mot de passe est obligatoire")
    @Pattern(regexp = CommentRules.PASSWORD_PATTERN, message = CommentRules.PASSWORD_PATTERN_MESSAGE)
    @Schema(example = "q3Jf0c1x9V7mKkZb2Yw8uT4sR6pN5oLhGdEaCiBjQ0M")
    private String password;
}
