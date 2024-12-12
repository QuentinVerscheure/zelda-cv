package zeldaCV.service;

import zeldaCV.converter.UserMapper;
import zeldaCV.dto.UserDTO;
import zeldaCV.model.UserEntity;
import zeldaCV.repository.UserRepository;
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
            UserMapper.entityToBean(userEntity)
        );
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
        UserEntity userEntity = UserMapper.beanToEntity(UserMapper.dtoToBean(userDTO));
        UserEntity savedUser = userRepository.save(userEntity);
        return UserMapper.beanToDto(UserMapper.entityToBean(savedUser));
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        UserEntity existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setPseudo(userDTO.getPseudo());
        UserEntity updatedUser = userRepository.save(existingUser);
        return UserMapper.beanToDto(UserMapper.entityToBean(updatedUser));
    }

    @Override
    public void deleteUser(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(userEntity);
    }
}
