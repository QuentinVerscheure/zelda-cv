package zeldaCV.converter;

import zeldaCV.dto.CommentDTO;

import zeldaCV.bean.CommentBean;
import zeldaCV.model.CommentEntity;

public class CommentMapper {

    // DTO -> Bean
    public static CommentBean dtoToBean(CommentDTO commentDto) {
        CommentBean commentBean = new CommentBean();
        commentBean.setId(commentDto.getId());
        commentBean.setComment(commentDto.getComment());
        commentBean.setCoordinateX(commentDto.getCoordinateX());
        commentBean.setCoordinateY(commentDto.getCoordinateY());
        commentBean.setUserId(commentDto.getUserId());
        return commentBean;
    }

    // Bean -> Entity
    public static CommentEntity beanToEntity(CommentBean commentBean) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setId(commentBean.getId());
        commentEntity.setComment(commentBean.getComment());
        commentEntity.setCoordinateX(commentBean.getCoordinateX());
        commentEntity.setCoordinateY(commentBean.getCoordinateY());
        commentEntity.setId(commentBean.getUserId());
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
        CommentDTO commentDto = new CommentDTO();
        commentDto.setId(commentBean.getId());
        commentDto.setComment(commentBean.getComment());
        commentDto.setCoordinateX(commentBean.getCoordinateX());
        commentDto.setCoordinateY(commentBean.getCoordinateY());
        commentDto.setUserId(commentBean.getUserId());
        return commentDto;
    }
}
