package com.bazaarnepal.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportInput {

    @NotBlank
    private String targetType;

    @NotBlank
    private String targetId;

    @NotBlank
    private String reason;

    private String description;

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
