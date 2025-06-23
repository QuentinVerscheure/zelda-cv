package zeldaCV.service;

import zeldaCV.dto.UserDTO;
import zeldaCV.dto.UserResponseDTO;

public interface UserService {
    UserDTO getCurrentUser();
    UserResponseDTO createUser(UserDTO userDto);
    UserResponseDTO updateUser(UserDTO userDto);
    boolean deleteCurrentUser();
}
