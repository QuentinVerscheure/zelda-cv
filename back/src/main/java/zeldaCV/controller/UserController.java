package zeldaCV.controller;

import zeldaCV.dto.UserDTO;
import zeldaCV.dto.UserResponseDTO;
import zeldaCV.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;

@RestController
@RequestMapping({"/api/users"})
@Tag(name = "users", description = "Operations related to a users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get the current user", 
    description = "Get the current user")
    public ResponseEntity<UserDTO> getCurrentUser() {
        UserDTO user = userService.getCurrentUser();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Create a new user", 
    description = "Create a new user", 
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true, 
        content = @Content(
            schema = @Schema(implementation = UserDTO.class), 
            examples = @ExampleObject(
                value = "{\n"+
            "  \"pseudo\": \"Link\",\n" +
            "  \"pass\": \"Zelda\",\n" +
            "  \"achievement\": {\n" +
            "    \"cv\": true,\n" +
            "    \"cvDownload\": true,\n" +
            "    \"portfolio\": true,\n" +
            "    \"link\": true,\n" +
            "    \"linkClick\": true,\n" +
            "    \"phone\": true,\n" +
            "    \"phoneContact\": true,\n" +
            "    \"guestBook\": true,\n" +
            "    \"guestBookComment\": true,\n" +
            "    \"achievementVarious\": true,\n" +
            "    \"achievementCredit\": true\n" +
            "  }\n" +
            "}"))))
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserDTO userDto) {
        UserResponseDTO createdUser = userService.createUser(userDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping
    @Operation(
        summary = "Update an existing user",
        description = "Update an existing user",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                schema = @Schema(implementation = UserDTO.class),
                examples = @ExampleObject(
                    value = "{ \"pseudo\": \"Link\", \"pass\": \"Zelda\" }"
                )
            )
        )
    )
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserDTO userDto) {
        UserResponseDTO updatedUser = userService.updateUser(userDto);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping
    @Operation(summary = "Delete a user by token", description = "Delete the curent user")
    public ResponseEntity<Object> deleteUser() {
        if (userService.deleteCurrentUser()) {
            return new ResponseEntity<>(Map.of("message", "User successfully deleted"), HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(Map.of("error", "You are not allowed to delete this user."), HttpStatus.FORBIDDEN);
        }
    }

}
