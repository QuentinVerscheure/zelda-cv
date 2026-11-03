package zeldaCV.service;

import zeldaCV.bean.CommentBean;
import zeldaCV.converter.CommentMapper;
import zeldaCV.dto.CommentCreateDTO;
import zeldaCV.dto.CommentDTO;
import zeldaCV.dto.CommentUpdateDTO;
import zeldaCV.model.CommentEntity;
import zeldaCV.repository.CommentRepository;
import zeldaCV.util.CommentPassword;
import zeldaCV.util.CommentRules;
import zeldaCV.util.Pseudo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final Clock clock;

    // fixe dimentions of the message. DO NOT CHANGE.
    // if you change it, the back can't remember the dimentions of the olds messages and will not be able
    // to check collision with old and new dimentions
    private static final int COMMENT_WIDTH = 131;
    private static final int COMMENT_HEIGHT = 44;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this(commentRepository, Clock.systemUTC());
    }

    CommentServiceImpl(CommentRepository commentRepository, Clock clock) {
        this.commentRepository = commentRepository;
        this.clock = clock;
    }

    @Override
    public List<CommentDTO> getAllComments() {
        return commentRepository.findAll().stream()
                .map(CommentMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(CommentCreateDTO commentCreateDto) {
        CommentBean commentBean = CommentMapper.createDtoToBean(commentCreateDto);
        commentBean.setPseudo(commentBean.getPseudo().trim());
        commentBean.setComment(normalizeText(commentBean.getComment()));

        if (Pseudo.isForbidden(commentBean.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce pseudo n'est pas autorisé");
        }
        if (!this.commentVerification(commentBean)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment is not valid: it overlaps a forbidden area or another comment.");
        }

        commentBean.setCreatedAt(now());
        CommentEntity commentEntity = CommentMapper.beanToEntity(commentBean);
        commentEntity.setPasswordHash(CommentPassword.hash(commentCreateDto.getPassword()));

        return CommentMapper.entityToDto(commentRepository.save(commentEntity));
    }

    @Override
    public boolean verifyPassword(Long id, String password) {
        CommentEntity commentEntity = findComment(id);
        return isEditWindowOpen(commentEntity) && CommentPassword.matches(password, commentEntity.getPasswordHash());
    }

    @Override
    public CommentDTO updateComment(Long id, CommentUpdateDTO commentUpdateDto) {
        CommentEntity existingCommentEntity = findAuthorizedComment(id, commentUpdateDto.getPassword());

        CommentBean commentBean = CommentMapper.entityToBean(existingCommentEntity);
        commentBean.setComment(normalizeText(commentUpdateDto.getComment()));
        commentBean.setCoordinateX(commentUpdateDto.getCoordinateX());
        commentBean.setCoordinateY(commentUpdateDto.getCoordinateY());

        if (!this.commentVerification(commentBean)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment is not valid: it overlaps a forbidden area or another comment.");
        }

        existingCommentEntity.setComment(commentBean.getComment());
        existingCommentEntity.setCoordinateX(commentBean.getCoordinateX());
        existingCommentEntity.setCoordinateY(commentBean.getCoordinateY());
        return CommentMapper.entityToDto(commentRepository.save(existingCommentEntity));
    }

    @Override
    public void deleteComment(Long id, String password) {
        commentRepository.delete(findAuthorizedComment(id, password));
    }

    private CommentEntity findComment(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message introuvable"));
    }

    /**
     * Returns the comment if the password matches and the edit window is still open.
     * @throws ResponseStatusException 404 if the comment does not exist, 403 otherwise
     */
    private CommentEntity findAuthorizedComment(Long id, String password) {
        CommentEntity commentEntity = findComment(id);
        if (!CommentPassword.matches(password, commentEntity.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous n'êtes pas autorisé à modifier ce message");
        }
        if (!isEditWindowOpen(commentEntity)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Le délai de modification de " + CommentRules.EDIT_WINDOW_DAYS + " jours est dépassé");
        }
        return commentEntity;
    }

    private boolean isEditWindowOpen(CommentEntity commentEntity) {
        return now().isBefore(commentEntity.getCreatedAt().plus(CommentRules.EDIT_WINDOW));
    }

    private LocalDateTime now() {
        return LocalDateTime.now(clock);
    }

    /**
     * Line breaks would push the text out of the fixed-size message box: they are replaced by spaces.
     * The length is checked again after trimming (validation already rejected texts that were too long).
     */
    private static String normalizeText(String text) {
        String normalized = text.replaceAll("\\s*[\\r\\n]+\\s*", " ").trim();
        if (normalized.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le message est obligatoire");
        }
        return normalized;
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
}
