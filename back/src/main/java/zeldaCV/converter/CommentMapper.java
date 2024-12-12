package zeldaCV.converter;

import zeldaCV.dto.CommentDTO;
import zeldaCV.bean.CommentBean;
import zeldaCV.model.CommentEntity;

public class CommentMapper {

    // DTO -> Bean
    public static CommentBean dtoToBean(CommentDTO commentDTO) {
        CommentBean commentBean = new CommentBean();
        commentBean.setId(commentDTO.getId()); 
        commentBean.setComment(commentDTO.getComment());
        commentBean.setCoordinateX(commentDTO.getCoordinateX());
        commentBean.setCoordinateY(commentDTO.getCoordinateY());
        commentBean.setUserId(commentDTO.getUserId());
        return commentBean;
    }

    // Bean -> Entity
    public static CommentEntity beanToEntity(CommentBean commentBean) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setId(commentBean.getId());
        commentEntity.setComment(commentBean.getComment());
        commentEntity.setCoordinateX(commentBean.getCoordinateX());
        commentEntity.setCoordinateY(commentBean.getCoordinateY());
        return commentEntity;
    }

    // Entity -> Bean
    public static CommentBean entityToBean(CommentEntity commentEntity) {
        CommentBean commentbean = new CommentBean();
        commentbean.setId(commentEntity.getId());
        commentbean.setComment(commentEntity.getComment());
        commentbean.setCoordinateX(commentEntity.getCoordinateX());
        commentbean.setCoordinateY(commentEntity.getCoordinateY());
        commentbean.setUserId(commentEntity.getUser().getId());
        return commentbean;
    }

    // Bean -> DTO
    public static CommentDTO beanToDto(CommentBean commentBean) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(commentBean.getId());
        commentDTO.setComment(commentBean.getComment());
        commentDTO.setCoordinateX(commentBean.getCoordinateX());
        commentDTO.setCoordinateY(commentBean.getCoordinateY());
        commentDTO.setUserId(commentBean.getUserId());
        return commentDTO;
    }
}
