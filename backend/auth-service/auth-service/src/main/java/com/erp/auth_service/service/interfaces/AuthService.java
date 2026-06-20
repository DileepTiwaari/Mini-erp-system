package com.erp.auth_service.service.interfaces;

import com.erp.auth_service.dto.request.LoginRequest;
import com.erp.auth_service.dto.request.RefreshTokenRequest;
import com.erp.auth_service.dto.request.RegisterRequest;
import com.erp.auth_service.dto.request.UserUpdateRequest;
import com.erp.auth_service.dto.response.AuthResponse;
import com.erp.auth_service.dto.response.TokenResponse;
import com.erp.auth_service.dto.response.UserResponse;

import java.util.List;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    TokenResponse refreshToken(RefreshTokenRequest request);
    void logout(String username);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}