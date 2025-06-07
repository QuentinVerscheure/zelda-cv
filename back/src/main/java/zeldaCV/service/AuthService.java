package zeldaCV.service;

import zeldaCV.dto.LoginDTO;

public interface AuthService {
    // Authenticates a user with pseudo and password, returns a JWT token if successful
    String login(LoginDTO loginDto);
}
