package com.styleai.dto;

import java.util.List;

public class OutfitSuggestionResponse {
    private List<OutfitSuggestion> outfitSuggestions;

    // Constructors
    public OutfitSuggestionResponse() {}

    public OutfitSuggestionResponse(List<OutfitSuggestion> outfitSuggestions) {
        this.outfitSuggestions = outfitSuggestions;
    }

    // Getters and Setters
    public List<OutfitSuggestion> getOutfitSuggestions() { return outfitSuggestions; }
    public void setOutfitSuggestions(List<OutfitSuggestion> outfitSuggestions) { this.outfitSuggestions = outfitSuggestions; }

    public static class OutfitSuggestion {
        private String outfit;
        private String occasion;
        private String reasoning;
        private List<Long> itemIds;

        // Constructors
        public OutfitSuggestion() {}

        public OutfitSuggestion(String outfit, String occasion, String reasoning, List<Long> itemIds) {
            this.outfit = outfit;
            this.occasion = occasion;
            this.reasoning = reasoning;
            this.itemIds = itemIds;
        }

        // Getters and Setters
        public String getOutfit() { return outfit; }
        public void setOutfit(String outfit) { this.outfit = outfit; }

        public String getOccasion() { return occasion; }
        public void setOccasion(String occasion) { this.occasion = occasion; }

        public String getReasoning() { return reasoning; }
        public void setReasoning(String reasoning) { this.reasoning = reasoning; }

        public List<Long> getItemIds() { return itemIds; }
        public void setItemIds(List<Long> itemIds) { this.itemIds = itemIds; }
    }
}