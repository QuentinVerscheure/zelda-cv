package zeldaCV.service;

import zeldaCV.bean.UserBean;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.converter.UserMapper;
import zeldaCV.dto.UserDTO;
import zeldaCV.dto.UserResponseDTO;
import zeldaCV.model.AchievementEntity;
import zeldaCV.model.UserEntity;
import zeldaCV.repository.AchievementRepository;
import zeldaCV.repository.UserRepository;
import zeldaCV.util.Achievement;
import zeldaCV.util.pseudo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import zeldaCV.dto.LoginDTO;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    public UserResponseDTO createUser(UserDTO userDTO) {
        UserBean userBean = UserMapper.dtoToBean(userDTO);

        // Check for forbidden pseudo
        if (pseudo.isForbidden(userBean.getPseudo())) {
            throw new RuntimeException("This username is not allowed. Please choose another one.");
        }

        if (userRepository.existsByPseudo(userBean.getPseudo())) {
            throw new RuntimeException("This pseudo is already used by another user.");
        }

        if (!Achievement.checkAchievement(AchievementMapper.dtoToBean(userDTO.getAchievement()))) {
            throw new RuntimeException("Achievements are not correct");
        }

        userBean.setPass(passwordEncoder.encode(userBean.getPass()));

        UserEntity userEntity = UserMapper.beanToEntity(userBean);

        userEntity.setAchievement(null);
        UserEntity savedUser = userRepository.save(userEntity);


        if (userDTO.getAchievement() != null) {
            AchievementEntity achievementEntity = AchievementMapper.beanToEntity(
                userBean.getAchievements(), new AchievementEntity());
            achievementEntity.setUser(savedUser);
            AchievementEntity savedAchievement = achievementRepository.save(achievementEntity);
            savedUser.setAchievement(savedAchievement);
            userRepository.save(savedUser);
        }
        
        LoginDTO loginDto = new LoginDTO();
        loginDto.setUser(userDTO.getPseudo());
        loginDto.setPassword(userDTO.getPass());
        String token = authService.login(loginDto);

        return new UserResponseDTO(token, HttpStatus.CREATED,
                UserMapper.beanToDto(UserMapper.entityToBean(userEntity)));
    }

    @Override
    public UserResponseDTO updateUser(UserDTO newUserDTO) {
        UserEntity existingUserEntity = userRepository.findById(newUserDTO.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserBean newUserBean = UserMapper.dtoToBean(newUserDTO);

        if (pseudo.isForbidden(newUserBean.getPseudo())) {
            throw new RuntimeException("This username is not allowed. Please choose another one.");
        }
        if (userRepository.existsByPseudo(newUserBean.getPseudo()) &&
                !existingUserEntity.getPseudo().equals(newUserBean.getPseudo())) {
            throw new RuntimeException("This pseudo is already used by another user.");
        }

        existingUserEntity.setPseudo(newUserBean.getPseudo());
        existingUserEntity.setPass(passwordEncoder.encode(newUserBean.getPass()));

        UserEntity updatedUser = userRepository.save(existingUserEntity);

        LoginDTO loginDto = new LoginDTO();
        loginDto.setUser(updatedUser.getPseudo());
        loginDto.setPassword(newUserDTO.getPass());

        String token = authService.login(loginDto);

        return new UserResponseDTO(token, HttpStatus.CREATED,
                UserMapper.beanToDto(UserMapper.entityToBean(updatedUser)));
    }

    @Override
    public boolean deleteUser(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication != null ? authentication.getName() : null;

        if (currentUsername == null || !currentUsername.equals(userEntity.getPseudo())) {
            return false;
        }

        userRepository.delete(userEntity);
        return true;

    }
}
