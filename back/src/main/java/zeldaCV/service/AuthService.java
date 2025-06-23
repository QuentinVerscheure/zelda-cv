package zeldaCV.service;

import zeldaCV.dto.LoginDTO;

public interface AuthService {
    String login(LoginDTO loginDto);
}
