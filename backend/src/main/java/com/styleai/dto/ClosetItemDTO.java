package com.styleai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.List;

public class ClosetItemDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Color is required")
    private String color;
    
    @NotEmpty(message = "At least one season is required")
    private List<String> seasons;
    
    private String imageUrl;
    private LocalDate lastWorn;
    private LocalDate previousLastWorn;
    private String dataAiHint;

    // Constructors
    public ClosetItemDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getSeasons() { return seasons; }
    public void setSeasons(List<String> seasons) { this.seasons = seasons; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDate getLastWorn() { return lastWorn; }
    public void setLastWorn(LocalDate lastWorn) { this.lastWorn = lastWorn; }

    public LocalDate getPreviousLastWorn() { return previousLastWorn; }
    public void setPreviousLastWorn(LocalDate previousLastWorn) { this.previousLastWorn = previousLastWorn; }

    public String getDataAiHint() { return dataAiHint; }
    public void setDataAiHint(String dataAiHint) { this.dataAiHint = dataAiHint; }
}