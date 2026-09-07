package com.bazaarnepal.security;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    public static final int MAX_ATTEMPTS = 5;
    public static final Duration LOCKOUT = Duration.ofMinutes(15);
    public static final Duration RESET_WINDOW = Duration.ofMinutes(15);

    private final ConcurrentHashMap<String, AttemptState> attempts = new ConcurrentHashMap<>();

    public void recordFailure(String key) {
        attempts.compute(key, (k, state) -> {
            AttemptState s = state == null ? new AttemptState() : state;
            Instant now = Instant.now();
            if (s.lastFailure == null || Duration.between(s.lastFailure, now).compareTo(RESET_WINDOW) > 0) {
                s = new AttemptState();
            }
            s.count++;
            s.lastFailure = now;
            if (s.count >= MAX_ATTEMPTS) {
                s.lockedUntil = now.plus(LOCKOUT);
            }
            return s;
        });
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    public boolean isBlocked(String key) {
        AttemptState s = attempts.get(key);
        if (s == null) {
            return false;
        }
        if (s.lockedUntil != null) {
            if (Instant.now().isBefore(s.lockedUntil)) {
                return true;
            }
            attempts.remove(key);
        }
        return false;
    }

    private static class AttemptState {
        int count;
        Instant lastFailure;
        Instant lockedUntil;
    }
}
