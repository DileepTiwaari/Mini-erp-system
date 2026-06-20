package com.erp.auth_service.service.interfaces;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateToken(UserDetails userDetails, String role);
    String extractUsername(String token);
    String extractRole(String token);
    boolean validateToken(String token, UserDetails userDetails);
    boolean isTokenExpired(String token);
}