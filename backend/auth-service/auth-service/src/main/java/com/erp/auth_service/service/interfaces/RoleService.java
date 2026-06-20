package com.erp.auth_service.service.interfaces;

import com.erp.auth_service.enums.Role;

public interface RoleService {
    boolean hasRole(String username, Role role);
    Role getRoleByUsername(String username);
}