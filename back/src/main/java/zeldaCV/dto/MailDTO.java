package zeldaCV.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailDTO {
    @Size(max = 254, message = "L'adresse de contact ne doit pas dépasser 254 caractères")
    private String from;
    @Size(max = 200, message = "Le sujet ne doit pas dépasser 200 caractères")
    private String subject;
    @Size(max = 5000, message = "Le message ne doit pas dépasser 5000 caractères")
    private String text;
}
