package com.styleai.dto;

public class AIAnalysisRequest {
    private String imageBase64;
    private String prompt;

    // Constructors
    public AIAnalysisRequest() {}

    public AIAnalysisRequest(String imageBase64, String prompt) {
        this.imageBase64 = imageBase64;
        this.prompt = prompt;
    }

    // Getters and Setters
    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}