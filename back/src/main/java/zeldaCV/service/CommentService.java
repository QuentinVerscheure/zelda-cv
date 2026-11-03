package zeldaCV.service;

import zeldaCV.dto.CommentCreateDTO;
import zeldaCV.dto.CommentDTO;
import zeldaCV.dto.CommentUpdateDTO;

import java.util.List;

public interface CommentService {
    List<CommentDTO> getAllComments();
    CommentDTO createComment(CommentCreateDTO commentCreateDto);
    /** true if the password matches the comment and its edit window is still open. */
    boolean verifyPassword(Long id, String password);
    CommentDTO updateComment(Long id, CommentUpdateDTO commentUpdateDto);
    void deleteComment(Long id, String password);
}
