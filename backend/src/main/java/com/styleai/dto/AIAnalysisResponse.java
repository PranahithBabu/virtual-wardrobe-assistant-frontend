package com.styleai.dto;

import java.util.List;

public class AIAnalysisResponse {
    private String name;
    private String category;
    private String color;
    private List<String> seasons;
    private String dataAiHint;

    // Constructors
    public AIAnalysisResponse() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getSeasons() { return seasons; }
    public void setSeasons(List<String> seasons) { this.seasons = seasons; }

    public String getDataAiHint() { return dataAiHint; }
    public void setDataAiHint(String dataAiHint) { this.dataAiHint = dataAiHint; }
}