package com.styleai.dto;

import jakarta.validation.constraints.NotBlank;

public class AITextToImageRequest {
    @NotBlank(message = "Item name is required")
    private String itemName;

    private String description;

    // Constructors
    public AITextToImageRequest() {}

    public AITextToImageRequest(String itemName, String description) {
        this.itemName = itemName;
        this.description = description;
    }

    // Getters and Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}