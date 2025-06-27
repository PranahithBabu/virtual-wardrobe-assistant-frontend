package com.styleai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class OutfitDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotEmpty(message = "At least one item is required")
    private List<Long> itemIds;
    
    private String reasoning;

    // Constructors
    public OutfitDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Long> getItemIds() { return itemIds; }
    public void setItemIds(List<Long> itemIds) { this.itemIds = itemIds; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
}