package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.AuthPayload;
import com.bazaarnepal.dto.LoginInput;
import com.bazaarnepal.dto.RegisterInput;
import com.bazaarnepal.security.JwtTokenProvider;
import com.bazaarnepal.security.LoginRateLimiter;
import com.bazaarnepal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class AuthResolver {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final LoginRateLimiter loginRateLimiter;

    public AuthResolver(UserService userService, JwtTokenProvider jwtTokenProvider, LoginRateLimiter loginRateLimiter) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.loginRateLimiter = loginRateLimiter;
    }

    @MutationMapping
    public AuthPayload register(@Argument @Valid RegisterInput input) {
        User user = userService.register(input.getName(), input.getEmail(), input.getPassword(), input.getPhone());
        String token = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        return new AuthPayload(user, token, refreshToken);
    }

    @MutationMapping
    public AuthPayload login(@Argument @Valid LoginInput input) {
        String key = rateLimitKey(input.getEmail());
        if (loginRateLimiter.isBlocked(key)) {
            throw new IllegalStateException("Too many failed login attempts. Try again in 15 minutes.");
        }
        try {
            User user = userService.login(input.getEmail(), input.getPassword());
            loginRateLimiter.recordSuccess(key);
            String token = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
            return new AuthPayload(user, token, refreshToken);
        } catch (RuntimeException e) {
            loginRateLimiter.recordFailure(key);
            throw e;
        }
    }

    @MutationMapping
    public AuthPayload refreshToken(@Argument String token) {
        if (!jwtTokenProvider.validateRefreshToken(token)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = userService.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        return new AuthPayload(user, accessToken, refreshToken);
    }

    private String rateLimitKey(String email) {
        return email.trim().toLowerCase() + "|" + clientIp();
    }

    private String clientIp() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            String xff = request.getHeader("X-Forwarded-For");
            if (xff != null && !xff.isBlank()) {
                return xff.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
