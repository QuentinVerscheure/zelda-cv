package zeldaCV.converter;

import zeldaCV.dto.UserDTO;
import zeldaCV.bean.UserBean;
import zeldaCV.model.UserEntity;

public class UserMapper {

    // DTO -> Bean
    public static UserBean dtoToBean(UserDTO userDTO) {
        return new UserBean(userDTO.getId(), userDTO.getPseudo(), userDTO.getPass());
    }

    // Bean -> Entity
    public static UserEntity beanToEntity(UserBean userBean) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userBean.getId());
        userEntity.setPseudo(userBean.getPseudo());
        return userEntity;
    }

    // Entity -> Bean
    public static UserBean entityToBean(UserEntity userEntity) {
        return new UserBean(
            userEntity.getId(), 
            userEntity.getPseudo(),
            userEntity.getPass()
            );
    }

    // Bean -> DTO
    public static UserDTO beanToDto(UserBean userBean) {
        return new UserDTO(userBean.getId(), userBean.getPseudo(), null, null);
    }
}
