package zeldaCV.service;

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
    public List<CommentDTO> getAllComments() {
        List<CommentEntity> comments = commentRepository.findAll();
        return comments.stream()
                .map(CommentMapper::entityToBean)
                .map(CommentMapper::beanToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        CommentEntity commentEntity = CommentMapper.beanToEntity(CommentMapper.dtoToBean(commentDTO));
        CommentEntity savedComment = commentRepository.save(commentEntity);
        return CommentMapper.beanToDto(CommentMapper.entityToBean(savedComment));
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) {
        CommentEntity existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingComment.setComment(commentDTO.getComment());
        existingComment.setCoordinateX(commentDTO.getCoordinateX());
        existingComment.setCoordinateY(commentDTO.getCoordinateY());
        CommentEntity updatedComment = commentRepository.save(existingComment);
        return CommentMapper.beanToDto(CommentMapper.entityToBean(updatedComment));
    }

    @Override
    public void deleteComment(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(commentEntity);
    }
}
