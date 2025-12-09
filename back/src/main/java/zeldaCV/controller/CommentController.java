package zeldaCV.controller;

import zeldaCV.dto.CommentDTO;
import zeldaCV.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping({"/api/comments"})
@Tag(name = "Comment", description = "Operations related to the comments a user can leave in the guestHouse")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    @Operation(summary = "Get all comments", description = "Get all comments of all user in the database")
    public List<CommentDTO> getAllComments() {
        return commentService.getAllComments();
    }

    @PostMapping
    @Operation(summary = "Create a new comment", 
    description = "Create a new comment for the current user", 
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true, 
        content = @Content(
            schema = @Schema(implementation = CommentDTO.class), 
            examples = @ExampleObject(
                value = "{\n" +
                        "  \"comment\": \"string\",\n" +
                        "  \"coordinateX\": 1000,\n" +
                        "  \"coordinateY\": 1000\n" +
                        "}"
            ))))
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDto) {
        CommentDTO createdCommentDto = commentService.createComment(commentDto);
        return new ResponseEntity<>(createdCommentDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing comment", 
    description = "Update an existing comment by id",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true, 
        content = @Content(
            schema = @Schema(implementation = CommentDTO.class), 
            examples = @ExampleObject(
                value = "{\n" +
                        "  \"comment\": \"string\",\n" +
                        "  \"coordinateX\": 1000,\n" +
                        "  \"coordinateY\": 1000\n" +
                        "}"
            ))))
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @RequestBody CommentDTO commentDto, Principal principal) {
        CommentDTO updatedCommentDto = commentService.updateComment(id, commentDto);
        return ResponseEntity.ok(updatedCommentDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a comment", description = "Delete an existing comment by ID")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
