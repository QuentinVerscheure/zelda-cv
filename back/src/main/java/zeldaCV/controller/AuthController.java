package zeldaCV.controller;

import lombok.AllArgsConstructor;
import zeldaCV.dto.LoginDTO;
import zeldaCV.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import zeldaCV.security.jwt.JwtAuthResponse;    

@AllArgsConstructor
@RestController
@RequestMapping({"/api/auth","/auth"})
public class AuthController {

    private final AuthService authService;


    @PostMapping("/login")
    @Operation(summary = "login", 
    description = "Login user", 
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true, 
        content = @Content(
            schema = @Schema(implementation = LoginDTO.class), 
            examples = @ExampleObject(
                value = "{\n" +
                        "  \"pseudo\": \"Link\",\n" +
                        "  \"pass\": \"Zelda\"\n" +
                        "}"
            ))))
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDTO loginDto){
        String token = authService.login(loginDto);

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);

        return  ResponseEntity.ok(jwtAuthResponse);
    }

}

