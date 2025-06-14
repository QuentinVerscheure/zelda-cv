package zeldaCV.converter;

import zeldaCV.dto.UserDTO;

import java.util.stream.Collectors;

import zeldaCV.bean.UserBean;
import zeldaCV.model.AchievementEntity;
import zeldaCV.model.UserEntity;

public class UserMapper {

        // DTO -> Bean
        public static UserBean dtoToBean(UserDTO userDTO) {
                UserBean userBean = new UserBean();
                userBean.setId(userDTO.getId());
                userBean.setPseudo(userDTO.getPseudo());
                userBean.setPass(userDTO.getPass());
                userBean.setAchievements(
                                userDTO.getAchievement() == null
                                                ? null
                                                : AchievementMapper.dtoToBean(userDTO.getAchievement()));
                return userBean;
        }

        // Bean -> Entity
        public static UserEntity beanToEntity(UserBean userBean) {
                UserEntity userEntity = new UserEntity();
                AchievementEntity achievementEntity = new AchievementEntity();
                userEntity.setId(userBean.getId());
                userEntity.setPseudo(userBean.getPseudo());
                userEntity.setPass(userBean.getPass());
                userEntity.setAchievement(userBean.getAchievements() == null
                                ? null
                                : AchievementMapper.beanToEntity(userBean.getAchievements(), achievementEntity));
                userEntity.setComments(
                                userBean.getComments() == null
                                                ? null
                                                : userBean.getComments().stream()
                                                                .map(CommentMapper::beanToEntity)
                                                                .collect(Collectors.toList()));
                return userEntity;
        }

        // Entity -> Bean
        public static UserBean entityToBean(UserEntity userEntity) {
                return new UserBean(
                                userEntity.getId(),
                                userEntity.getPseudo(),
                                userEntity.getPass(),
                                userEntity.getAchievement() == null
                                                ? null
                                                : AchievementMapper.entityToBean(userEntity.getAchievement()),
                                userEntity.getComments() == null
                                                ? null
                                                : userEntity.getComments().stream()
                                                                .map(CommentMapper::entityToBean)
                                                                .collect(Collectors.toList()));
        }

        // Bean -> DTO
        public static UserDTO beanToDto(UserBean bean) {
                if (bean == null) {
                        return null;
                }
                UserDTO dto = new UserDTO();
                dto.setId(bean.getId());
                dto.setPseudo(bean.getPseudo());
                dto.setPass(null); // Password should not be exposed
                if (bean.getAchievements() != null) {
                        dto.setAchievement(AchievementMapper.beanToDto(bean.getAchievements()));
                }
                return dto;
        }
}
