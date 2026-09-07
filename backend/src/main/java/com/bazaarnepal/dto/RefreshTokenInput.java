package com.bazaarnepal.dto;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenInput {

    @NotBlank
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
