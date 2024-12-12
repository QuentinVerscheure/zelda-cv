package zeldaCV.converter;

import java.lang.reflect.Method;

import zeldaCV.bean.AchievementBean;
import zeldaCV.constants.AchievementConstants;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.model.AchievementEntity;
import zeldaCV.model.UserEntity;

public class AchievementMapper {

    // Convert AchievementEntity to AchievementBean
    public static AchievementBean entityToBean(AchievementEntity entity) {
        if (entity == null) {
            return null;
        }

        AchievementBean bean = new AchievementBean();
        bean.setUserId(entity.getUser().getId());

        String[] ACHIEVEMENT_FIELDS = AchievementConstants.ACHIEVEMENT_FIELDS;

        //create       if (entity.isAchievement()) {bean.setAchievement(entity.isAchievement());}     for every achievement in the field
        try {
            for (String field : ACHIEVEMENT_FIELDS) {
                Method getter = AchievementEntity.class.getMethod("is" + field);
                Boolean value = (Boolean) getter.invoke(entity);
                if (value != null) {
                    Method setter = AchievementBean.class.getMethod("set" + field, Boolean.class);
                    setter.invoke(bean, value);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return bean;
    }

    // Convert AchievementBean to AchievementEntity
    public static AchievementEntity beanToEntity(AchievementBean bean) {
        if (bean == null) {
            return null;
        }

        AchievementEntity entity = new AchievementEntity();
        UserEntity user = new UserEntity(); // Create a new instance or fetch from repository
        user.setId(bean.getUserId());
        entity.setUser(user);

        String[] ACHIEVEMENT_FIELDS = AchievementConstants.ACHIEVEMENT_FIELDS;

                //create       if (bean.isAchievement()) {entity.setAchievement(bean.isAchievement());}     for every achievement in the field
        try {
            for (String field : ACHIEVEMENT_FIELDS) {
                Method getter = AchievementBean.class.getMethod("is" + field);
                Boolean value = (Boolean) getter.invoke(bean);
                if (value != null) {
                    Method setter = AchievementEntity.class.getMethod("set" + field, Boolean.class);
                    setter.invoke(entity, value);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return entity;
    }

    // Convert AchievementBean to AchievementDTO with null checks
    public static AchievementDTO beanToDto(AchievementBean bean) {
        if (bean == null) {
            return null;
        }

        AchievementDTO dto = new AchievementDTO();
        if (bean.getUserId() != null) {
            dto.setUserId(bean.getUserId());
        }

        String[] ACHIEVEMENT_FIELDS = AchievementConstants.ACHIEVEMENT_FIELDS;

        //create       if (bean.isAchievement()) {dto.setAchievement(bean.isAchievement());}     for every achievement in the field
        try {
            for (String field : ACHIEVEMENT_FIELDS) {
                Method getter = AchievementBean.class.getMethod("is" + field);
                Boolean value = (Boolean) getter.invoke(bean);
                if (value != null) {
                    Method setter = AchievementDTO.class.getMethod("set" + field, Boolean.class);
                    setter.invoke(dto, value);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return dto;
    }

    // Convert AchievementDTO to AchievementBean
    public static AchievementBean dtoToBean(AchievementDTO dto) {
        if (dto == null) {
            return null;
        }

        AchievementBean bean = new AchievementBean();
        bean.setUserId(dto.getUserId());

        String[] ACHIEVEMENT_FIELDS = AchievementConstants.ACHIEVEMENT_FIELDS;

        //create       if (dto.isAchievement()) {bean.setUserId(dto.getAchievement());}     for every achievement in the field
        
        try {
            for (String field : ACHIEVEMENT_FIELDS) {
                Method getter = AchievementDTO.class.getMethod("is" + field);
                Boolean value = (Boolean) getter.invoke(dto);
                if (value != null) {
                    Method setter = AchievementBean.class.getMethod("set" + field, Boolean.class);
                    setter.invoke(bean, value);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return bean;
    }
}
