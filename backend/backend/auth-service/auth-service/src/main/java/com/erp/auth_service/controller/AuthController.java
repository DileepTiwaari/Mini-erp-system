package com.erp.auth_service.controller;

import com.erp.auth_service.dto.request.LoginRequest;
import com.erp.auth_service.dto.request.RefreshTokenRequest;
import com.erp.auth_service.dto.request.RegisterRequest;
import com.erp.auth_service.dto.request.UserUpdateRequest;
import com.erp.auth_service.dto.response.AuthResponse;
import com.erp.auth_service.dto.response.TokenResponse;
import com.erp.auth_service.dto.response.UserResponse;
import com.erp.auth_service.service.interfaces.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully",
                "data", response));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "data", response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Token refreshed successfully",
                "data", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Users fetched successfully",
                "data", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserResponse user = authService.getUserById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User fetched successfully",
                "data", user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @Valid @RequestBody UserUpdateRequest request) {
        UserResponse user = authService.updateUser(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User updated successfully",
                "data", user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deleted successfully"));
    }
}