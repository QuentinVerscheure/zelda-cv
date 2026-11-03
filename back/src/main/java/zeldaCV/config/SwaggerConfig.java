package zeldaCV.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Zelda-cv API")
                .version("2.0")
                .description("API of a portfolio styled as a Game Boy game: guestbook (no account needed, "
                    + "each message is protected by its own password) and contact form."));
    }
}
