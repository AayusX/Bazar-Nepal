package com.bazaarnepal.service;

import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.UpdateProfileInput;
import org.springframework.security.core.Authentication;

import java.util.Optional;

public interface UserService {
    User register(String name, String email, String password, String phone);
    User login(String email, String password);
    User updateProfile(String userId, UpdateProfileInput input);
    User getCurrentUser(Authentication auth);
    Optional<User> findById(String id);
}
