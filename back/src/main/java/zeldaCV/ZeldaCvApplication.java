package zeldaCV;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ZeldaCvApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZeldaCvApplication.class, args);
    }
}
