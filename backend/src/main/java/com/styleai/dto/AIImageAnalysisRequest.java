package com.styleai.dto;

import jakarta.validation.constraints.NotBlank;

public class AIImageAnalysisRequest {
    @NotBlank(message = "Image data is required")
    private String imageBase64;

    // Constructors
    public AIImageAnalysisRequest() {}

    public AIImageAnalysisRequest(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    // Getters and Setters
    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
}