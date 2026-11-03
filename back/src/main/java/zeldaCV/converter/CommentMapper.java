package zeldaCV.converter;

import java.time.ZoneOffset;

import zeldaCV.bean.CommentBean;
import zeldaCV.dto.CommentCreateDTO;
import zeldaCV.dto.CommentDTO;
import zeldaCV.model.CommentEntity;

public class CommentMapper {

    private CommentMapper() {
    }

    public static CommentBean createDtoToBean(CommentCreateDTO dto) {
        CommentBean bean = new CommentBean();
        bean.setPseudo(dto.getPseudo());
        bean.setComment(dto.getComment());
        bean.setCoordinateX(dto.getCoordinateX());
        bean.setCoordinateY(dto.getCoordinateY());
        return bean;
    }

    /** The password hash is set by the service, never copied from a bean. */
    public static CommentEntity beanToEntity(CommentBean bean) {
        CommentEntity entity = new CommentEntity();
        entity.setId(bean.getId());
        entity.setPseudo(bean.getPseudo());
        entity.setComment(bean.getComment());
        entity.setCoordinateX(bean.getCoordinateX());
        entity.setCoordinateY(bean.getCoordinateY());
        entity.setCreatedAt(bean.getCreatedAt());
        return entity;
    }

    public static CommentBean entityToBean(CommentEntity entity) {
        CommentBean bean = new CommentBean();
        bean.setId(entity.getId());
        bean.setPseudo(entity.getPseudo());
        bean.setComment(entity.getComment());
        bean.setCoordinateX(entity.getCoordinateX());
        bean.setCoordinateY(entity.getCoordinateY());
        bean.setCreatedAt(entity.getCreatedAt());
        return bean;
    }

    public static CommentDTO beanToDto(CommentBean bean) {
        CommentDTO dto = new CommentDTO();
        dto.setId(bean.getId());
        dto.setComment(bean.getComment());
        dto.setCoordinateX(bean.getCoordinateX());
        dto.setCoordinateY(bean.getCoordinateY());
        dto.setUserPseudo(bean.getPseudo());
        dto.setDate(bean.getCreatedAt() == null ? null : bean.getCreatedAt().toInstant(ZoneOffset.UTC));
        return dto;
    }

    public static CommentDTO entityToDto(CommentEntity entity) {
        return beanToDto(entityToBean(entity));
    }
}
