package com.erp.auth_service.service.impl;

import com.erp.auth_service.entity.User;
import com.erp.auth_service.enums.Role;
import com.erp.auth_service.exception.UserNotFoundException;
import com.erp.auth_service.repository.UserRepository;
import com.erp.auth_service.service.interfaces.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean hasRole(String username, Role role) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        return user.getRole().equals(role);
    }

    @Override
    public Role getRoleByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        return user.getRole();
    }
}