package zeldaCV.converter;

import zeldaCV.dto.CommentDTO;

import zeldaCV.bean.CommentBean;
import zeldaCV.model.CommentEntity;

public class CommentMapper {

    public static CommentBean dtoToBean(CommentDTO commentDto) {
        CommentBean commentBean = new CommentBean();
        if (commentDto.getId() != null) {
            commentBean.setId(commentDto.getId());
        }
        commentBean.setComment(commentDto.getComment());
        commentBean.setCoordinateX(commentDto.getCoordinateX());
        commentBean.setCoordinateY(commentDto.getCoordinateY());
        commentBean.setDate(new java.sql.Date(System.currentTimeMillis()));
        return commentBean;
    }

    public static CommentEntity beanToEntity(CommentBean commentBean) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setId(commentBean.getId());
        commentEntity.setComment(commentBean.getComment());
        commentEntity.setCoordinateX(commentBean.getCoordinateX());
        commentEntity.setCoordinateY(commentBean.getCoordinateY());
        commentEntity.setId(commentBean.getUserId());
        commentEntity.setDate(new java.sql.Date(System.currentTimeMillis()));
        return commentEntity;
    }

    public static CommentBean entityToBean(CommentEntity commentEntity) {
        CommentBean commentbean = new CommentBean();
        commentbean.setId(commentEntity.getId());
        commentbean.setComment(commentEntity.getComment());
        commentbean.setCoordinateX(commentEntity.getCoordinateX());
        commentbean.setCoordinateY(commentEntity.getCoordinateY());
        commentbean.setUserId(commentEntity.getUser().getId());
        commentbean.setUserPseudo(commentEntity.getUser().getPseudo());
        commentbean.setDate(commentEntity.getDate());
        return commentbean;
    }

    public static CommentDTO beanToDto(CommentBean commentBean) {
        CommentDTO commentDto = new CommentDTO();
        commentDto.setId(commentBean.getId());
        commentDto.setComment(commentBean.getComment());
        commentDto.setCoordinateX(commentBean.getCoordinateX());
        commentDto.setCoordinateY(commentBean.getCoordinateY());
        commentDto.setUserPseudo(commentBean.getUserPseudo());
        commentDto.setDate(commentBean.getDate());
        return commentDto;
    }
}
