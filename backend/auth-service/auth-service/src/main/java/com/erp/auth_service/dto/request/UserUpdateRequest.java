package com.erp.auth_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @Email(message = "Email must be valid")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}