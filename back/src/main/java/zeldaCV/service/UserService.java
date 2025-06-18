package zeldaCV.service;

import zeldaCV.dto.UserDTO;
import zeldaCV.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    UserDTO getCurrentUser();
    List<UserDTO> getAllUsers();
    UserResponseDTO createUser(UserDTO userDto);
    UserResponseDTO updateUser(UserDTO userDto);
    boolean deleteCurrentUser();
}
