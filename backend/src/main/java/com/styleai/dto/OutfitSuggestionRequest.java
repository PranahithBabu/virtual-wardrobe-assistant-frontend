package com.styleai.dto;

import java.util.List;

public class OutfitSuggestionRequest {
    private List<ClosetItemDTO> closetItems;
    private String occasion;
    private String userPreferences;

    // Constructors
    public OutfitSuggestionRequest() {}

    // Getters and Setters
    public List<ClosetItemDTO> getClosetItems() { return closetItems; }
    public void setClosetItems(List<ClosetItemDTO> closetItems) { this.closetItems = closetItems; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getUserPreferences() { return userPreferences; }
    public void setUserPreferences(String userPreferences) { this.userPreferences = userPreferences; }
}