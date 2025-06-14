package zeldaCV.service;

import zeldaCV.dto.UserDTO;
import zeldaCV.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserResponseDTO createUser(UserDTO userDTO);
    UserResponseDTO updateUser(UserDTO userDTO);
    boolean deleteUser(Long id);
}
