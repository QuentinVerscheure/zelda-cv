package zeldaCV.service;

import zeldaCV.dto.CommentDTO;
import java.util.List;

public interface CommentService {
    CommentDTO getCommentById(Long id);
    List<CommentDTO> getCommentByPseudo(String pseudo);
    List<CommentDTO> getAllComments();
    CommentDTO createComment(CommentDTO commentDto);
    CommentDTO updateComment(Long id, CommentDTO commentDto);
    void deleteComment(Long id);
}
