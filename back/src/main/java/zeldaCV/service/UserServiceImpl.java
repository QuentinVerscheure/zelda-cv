package zeldaCV.service;

import zeldaCV.bean.UserBean;
import zeldaCV.converter.UserMapper;
import zeldaCV.dto.UserDTO;
import zeldaCV.model.UserEntity;
import zeldaCV.repository.UserRepository;
import zeldaCV.util.Achievement;
import zeldaCV.util.pseudo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO getUserById(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.beanToDto(
                UserMapper.entityToBean(userEntity));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::entityToBean)
                .map(UserMapper::beanToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        UserBean userBean = UserMapper.dtoToBean(userDTO);

        // Check for forbidden pseudo
        if (pseudo.isForbidden(userBean.getPseudo())) {
            throw new RuntimeException("This username is not allowed. Please choose another one.");
        }

        if (!Achievement.checkAchievement(userBean.getAchievements())) {
            throw new RuntimeException("Achievements are not correct");
        }

        UserEntity userEntity = UserMapper.beanToEntity(userBean);
        UserEntity savedUser = userRepository.save(userEntity);
        return UserMapper.beanToDto(UserMapper.entityToBean(savedUser));
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO newUserDTO) {
        UserEntity existingUserEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserBean newUserBean = UserMapper.dtoToBean(newUserDTO);
        UserBean existingUserBean = UserMapper.entityToBean(existingUserEntity);

        // id and pseudo can't be change in a user
        newUserBean.setId(existingUserBean.getId());
        newUserBean.setPseudo(existingUserBean.getPseudo());

        if (!Achievement.checkAchievement(newUserBean.getAchievements())) {
            throw new RuntimeException("Achievements are not correct");
        }

        UserEntity updatedUser = userRepository.save(UserMapper.beanToEntity(newUserBean));
        return UserMapper.beanToDto(UserMapper.entityToBean(updatedUser));

    }

    @Override
    public boolean deleteUser(Long id, String pass) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (pass == userEntity.getPass()) {
            userRepository.delete(userEntity);
            return true;
        } else {
            throw new RuntimeException("pass incorrect");
        }

    }
}
