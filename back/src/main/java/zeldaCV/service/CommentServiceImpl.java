package zeldaCV.service;

import zeldaCV.bean.CommentBean;
import zeldaCV.converter.CommentMapper;
import zeldaCV.dto.CommentDTO;
import zeldaCV.model.CommentEntity;
import zeldaCV.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public CommentDTO getCommentById(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return CommentMapper.beanToDto(CommentMapper.entityToBean(commentEntity));
    }

    @Override
    public List<CommentDTO> getCommentByPseudo(String pseudo) {
        List<CommentEntity> comments = commentRepository.findByUserPseudo(pseudo);
        return comments.stream()
                .map(CommentMapper::entityToBean)
                .map(CommentMapper::beanToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getAllComments() {
        List<CommentEntity> comments = commentRepository.findAll();
        return comments.stream()
                .map(CommentMapper::entityToBean)
                .map(CommentMapper::beanToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        CommentBean commentBean = CommentMapper.dtoToBean(commentDTO);

        if (!CommentServiceImpl.commentVerification(commentBean)) {
            throw new RuntimeException("comments are not correct");
        }

        CommentEntity commentEntity = CommentMapper.beanToEntity(commentBean);
        CommentEntity savedComment = commentRepository.save(commentEntity);
        return CommentMapper.beanToDto(CommentMapper.entityToBean(savedComment));
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) {

        CommentBean commentBean = CommentMapper.dtoToBean(commentDTO);

        if (!CommentServiceImpl.commentVerification(commentBean)) {
            throw new RuntimeException("comments are not correct");
        }

        CommentEntity commentEntity = CommentMapper.beanToEntity(commentBean);

        CommentEntity existingCommentEntity = commentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingCommentEntity.setComment(commentEntity.getComment());
        existingCommentEntity.setCoordinateX(commentEntity.getCoordinateX());
        existingCommentEntity.setCoordinateY(commentEntity.getCoordinateY());
        CommentEntity updatedComment = commentRepository.save(existingCommentEntity);
        return CommentMapper.beanToDto(CommentMapper.entityToBean(updatedComment));
    }

    @Override
    public void deleteComment(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(commentEntity);
    }

    public static boolean commentVerification(CommentBean commentBean) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'commentVerification'");
    }
}
