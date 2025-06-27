package com.styleai.dto;

public class AIImageGenerationRequest {
    private String description;
    private String name;
    private String category;
    private String color;
    private String season;

    // Constructors
    public AIImageGenerationRequest() {}

    // Getters and Setters
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
}