package com.bazaarnepal.dto;

import com.bazaarnepal.domain.User;

public class AuthPayload {

    private User user;
    private String token;
    private String refreshToken;

    public AuthPayload(User user, String token) {
        this.user = user;
        this.token = token;
    }

    public AuthPayload(User user, String token, String refreshToken) {
        this.user = user;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
