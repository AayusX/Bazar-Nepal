package com.bazaarnepal.service.impl;

import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.UpdateProfileInput;
import com.bazaarnepal.repository.UserRepository;
import com.bazaarnepal.service.UserService;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(String name, String email, String password, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        String encodedPassword = passwordEncoder.encode(password);
        String avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email;
        User user = new User(name, email, encodedPassword, avatar);
        if (phone != null) user.setPhone(phone);
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        if (!"active".equals(user.getAccountStatus())) {
            throw new IllegalStateException("Your account has been " + user.getAccountStatus() + ". Contact support.");
        }
        user.setOnlineStatus("online");
        user.setLastSeen(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateProfile(String userId, UpdateProfileInput input) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (input.getName() != null) user.setName(input.getName());
        if (input.getAvatar() != null) user.setAvatar(input.getAvatar());
        if (input.getPhone() != null) user.setPhone(input.getPhone());
        if (input.getWhatsapp() != null) user.setWhatsapp(input.getWhatsapp());
        if (input.getPhoneVisibility() != null) user.setPhoneVisibility(input.getPhoneVisibility());
        if (input.getWhatsappVisibility() != null) user.setWhatsappVisibility(input.getWhatsappVisibility());
        if (input.getEmailVisibility() != null) user.setEmailVisibility(input.getEmailVisibility());
        if (input.getDistrict() != null) user.setDistrict(input.getDistrict());
        if (input.getProvince() != null) user.setProvince(input.getProvince());
        if (input.getCountry() != null) user.setCountry(input.getCountry());
        if (input.getLatitude() != null) user.setLatitude(input.getLatitude());
        if (input.getLongitude() != null) user.setLongitude(input.getLongitude());
        if (input.getContactPreference() != null) user.setContactPreference(input.getContactPreference());
        if (input.getAllowPhoneCalls() != null) user.setAllowPhoneCalls(input.getAllowPhoneCalls());
        if (input.getAllowWhatsApp() != null) user.setAllowWhatsApp(input.getAllowWhatsApp());
        if (input.getAllowChat() != null) user.setAllowChat(input.getAllowChat());
        return userRepository.save(user);
    }

    @Override
    public User getCurrentUser(Authentication auth) {
        if (auth == null || auth instanceof AnonymousAuthenticationToken || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        User user = userRepository.findById(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!"active".equals(user.getAccountStatus())) {
            throw new IllegalStateException("Your account has been " + user.getAccountStatus() + ". Contact support.");
        }
        return user;
    }

    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
}
