package zeldaCV.controller;

import zeldaCV.dto.UserDTO;
import zeldaCV.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/users")
@Tag(name = "users", description = "Operations related to a users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{id}")
    @Operation(summary = "Get a user by ID", description = "Get a user by ID")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Create a new user", description = "Create a new user")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user", description = "Update an existing user")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user by ID", description = "Delete a user by ID")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        
        if (userService.deleteUser(id, userDTO.getPass())) {
            System.out.println("User successfully deleted: " + userDTO.getId());
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } else {
            System.out.println("User unsuccessfully deleted: " + userDTO.getId());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
