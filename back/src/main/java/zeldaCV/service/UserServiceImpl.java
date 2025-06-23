package zeldaCV.service;

import zeldaCV.bean.UserBean;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.converter.UserMapper;
import zeldaCV.dto.UserResponseDTO;
import zeldaCV.model.AchievementEntity;
import zeldaCV.model.UserEntity;
import zeldaCV.repository.AchievementRepository;
import zeldaCV.repository.UserRepository;
import zeldaCV.util.Achievement;
import zeldaCV.util.Pseudo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import zeldaCV.dto.LoginDTO;
import zeldaCV.dto.UserDTO;

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
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        UserEntity userEntity = userRepository.findByPseudo(pseudo)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.beanToDto(
                UserMapper.entityToBean(userEntity));
    }

    @Override
    public UserResponseDTO createUser(UserDTO userDto) {
        UserBean userBean = UserMapper.dtoToBean(userDto);

        if (Pseudo.isForbidden(userBean.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This username is not allowed. Please choose another one.");
        }

        if (userRepository.existsByPseudo(userBean.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This pseudo is already used by another user.");
        }

        if (!Achievement.checkAchievement(userBean.getAchievements())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Achievements are not correct");
        }

        userBean.setPass(passwordEncoder.encode(userBean.getPass()));

        UserEntity userEntity = UserMapper.beanToEntity(userBean);

        userEntity.setAchievement(null);
        UserEntity savedUser = userRepository.save(userEntity);


        if (userDto.getAchievement() != null) {
            AchievementEntity achievementEntity = AchievementMapper.beanToEntity(
                userBean.getAchievements(), new AchievementEntity());
            achievementEntity.setUser(savedUser);
            AchievementEntity savedAchievement = achievementRepository.save(achievementEntity);
            savedUser.setAchievement(savedAchievement);
            userRepository.save(savedUser);
        }
        
        LoginDTO loginDto = new LoginDTO();
        loginDto.setPseudo(userDto.getPseudo());
        loginDto.setPass(userDto.getPass());
        String token = authService.login(loginDto);

        return new UserResponseDTO(token, HttpStatus.CREATED,
                UserMapper.beanToDto(UserMapper.entityToBean(userEntity)));
    }

    @Override
    public UserResponseDTO updateUser(UserDTO newUserDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        UserEntity existingUserEntity = userRepository.findByPseudo(pseudo)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserBean newUserBean = UserMapper.dtoToBean(newUserDto);

        if (Pseudo.isForbidden(newUserBean.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This username is not allowed. Please choose another one.");
        }
        if (userRepository.existsByPseudo(newUserBean.getPseudo()) &&
                !existingUserEntity.getPseudo().equals(newUserBean.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This pseudo is already used by another user.");
        }
        
        existingUserEntity.setPseudo(newUserBean.getPseudo());
        existingUserEntity.setPass(passwordEncoder.encode(newUserBean.getPass()));

        UserEntity updatedUser = userRepository.save(existingUserEntity);

        LoginDTO loginDto = new LoginDTO();
        loginDto.setPseudo(updatedUser.getPseudo());
        loginDto.setPass(newUserBean.getPass());

        String token = authService.login(loginDto);

        return new UserResponseDTO(token, HttpStatus.ACCEPTED,
                UserMapper.beanToDto(UserMapper.entityToBean(updatedUser)));
                
    }

    @Override
    public boolean deleteCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        UserEntity userEntity = userRepository.findByPseudo(pseudo)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (pseudo == null || !pseudo.equals(userEntity.getPseudo())) {
            return false;
        }

        userRepository.delete(userEntity);
        return true;

    }
}
