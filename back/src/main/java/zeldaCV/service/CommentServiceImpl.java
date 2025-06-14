package zeldaCV.service;

import zeldaCV.bean.CommentBean;
import zeldaCV.converter.CommentMapper;
import zeldaCV.dto.CommentDTO;
import zeldaCV.model.CommentEntity;
import zeldaCV.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // size fix of the comment rectangle
    private static final int COMMENT_WIDTH = 131;
    private static final int COMMENT_HEIGHT = 44;

    // Auto-generated constructor stub
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public CommentDTO getCommentById(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return CommentMapper.beanToDTO(CommentMapper.entityToBean(commentEntity));
    }

    @Override
    public List<CommentDTO> getCommentByPseudo(String pseudo) {
        List<CommentEntity> comments = commentRepository.findByUserPseudo(pseudo);
        return comments.stream()
                .map(CommentMapper::entityToBean)
                .map(CommentMapper::beanToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getAllComments() {
        List<CommentEntity> comments = commentRepository.findAll();
        return comments.stream()
                .map(CommentMapper::entityToBean)
                .map(CommentMapper::beanToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        CommentBean commentBean = CommentMapper.dtoToBean(commentDTO);

        if (!this.commentVerification(commentBean)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment is not valid: it overlaps a forbidden area or another comment.");
        }

        CommentEntity commentEntity = CommentMapper.beanToEntity(commentBean);
        CommentEntity savedComment = commentRepository.save(commentEntity);
        return CommentMapper.beanToDTO(CommentMapper.entityToBean(savedComment));
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) {

        CommentBean commentBean = CommentMapper.dtoToBean(commentDTO);

        if (!isCurrentUserOwnerOfComment(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You are not authorized to modify this comment");
        }
        if (!this.commentVerification(commentBean)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Comment is not valid: it overlaps a forbidden area or another comment.");
        }

        CommentEntity commentEntity = CommentMapper.beanToEntity(commentBean);

        CommentEntity existingCommentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingCommentEntity.setComment(commentEntity.getComment());
        existingCommentEntity.setCoordinateX(commentEntity.getCoordinateX());
        existingCommentEntity.setCoordinateY(commentEntity.getCoordinateY());
        CommentEntity updatedComment = commentRepository.save(existingCommentEntity);
        return CommentMapper.beanToDTO(CommentMapper.entityToBean(updatedComment));
    }

    @Override
    public void deleteComment(Long id) {
        if (!isCurrentUserOwnerOfComment(id)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(commentEntity);
    }

        /**
     * Checks if the comment overlaps an existing comment.
     * 
     * @param commentBean The CommentBean containing the rectangle's coordinates.
     * @return false if overlapping, true otherwise
     */
    private boolean commentVerification(CommentBean commentBean) {
        List<CommentEntity> nearbyEntities = commentRepository.findNearbyComments(
            commentBean.getCoordinateX()-COMMENT_WIDTH, 
            commentBean.getCoordinateX()+COMMENT_WIDTH,
            commentBean.getCoordinateY()-COMMENT_HEIGHT,
            commentBean.getCoordinateY()+COMMENT_HEIGHT);
        List<CommentBean> allComments = nearbyEntities.stream()
            .map(CommentMapper::entityToBean)
            .collect(Collectors.toList());

        if (isOverlappingWithCommentsList(commentBean, allComments) || isOverlappingRestrictedArea(commentBean)) {
            return false;
        }
        return true;
    }

    /**
     * Checks if the comment rectangle (fixed size) at (coordinateX, coordinateY)
     * overlaps the restricted area.
     * 
     * @param commentBean The CommentBean containing the rectangle's coordinates.
     * @return true if overlapping, false otherwise
     */
    public static boolean isOverlappingRestrictedArea(CommentBean commentBean) {
        // Restricted area: {x, y, width, height}
        int[] restrictedCentralArea = { -10, -10, 228, 175 };

        int commentX = commentBean.getCoordinateX();
        int commentY = commentBean.getCoordinateY();

        // Rectangle for comment
        java.awt.Rectangle commentRect = new java.awt.Rectangle(commentX, commentY, COMMENT_WIDTH, COMMENT_HEIGHT);
        // Rectangle for restricted area
        java.awt.Rectangle restrictedRect = new java.awt.Rectangle(
                restrictedCentralArea[0],
                restrictedCentralArea[1],
                restrictedCentralArea[2],
                restrictedCentralArea[3]);

        // Check overlap with restricted area
        if (commentRect.intersects(restrictedRect)) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the comment rectangle (fixed size) at (coordinateX, coordinateY)
     * overlaps with any comment in the provided list.
     * 
     * @param commentBean   The CommentBean containing the rectangle's coordinates.
     * @param otherComments The list of CommentEntity to check against.
     * @return true if overlapping, false otherwise
     */
    public static boolean isOverlappingWithCommentsList(CommentBean commentBean, List<CommentBean> otherComments) {
        int commentX = commentBean.getCoordinateX();
        int commentY = commentBean.getCoordinateY();
        java.awt.Rectangle commentRect = new java.awt.Rectangle(commentX, commentY, COMMENT_WIDTH, COMMENT_HEIGHT);

        for (CommentBean otherComment : otherComments) {
            // Ignore the comment itself if updating
            if (commentBean.getId() != null && commentBean.getId().equals(otherComment.getId())) {
                continue;
            }
            int otherX = otherComment.getCoordinateX();
            int otherY = otherComment.getCoordinateY();
            java.awt.Rectangle otherRect = new java.awt.Rectangle(otherX, otherY, COMMENT_WIDTH, COMMENT_HEIGHT);
            if (commentRect.intersects(otherRect)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks in the database if the currently authenticated user is the owner of the comment.
     * @param commentId The ID of the comment to check.
     * @return true if the authenticated user is the owner, false otherwise.
     */
    public boolean isCurrentUserOwnerOfComment(Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String currentUsername = authentication.getName();
        // Query the DB to check if a comment with this id and this user pseudo exists
        return commentRepository.existsByIdAndUserPseudo(commentId, currentUsername);
    }
}
