package com.styleai.service;

import com.styleai.dto.*;
import com.styleai.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class AIService {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private UserService userService;

    private final Random random = new Random();

    public OutfitSuggestionResponse generateWeatherBasedOutfitSuggestions(WeatherBasedOutfitRequest request) {
        // Get weather data for the user's location
        Map<String, Object> weather = weatherService.getCurrentWeather(request.getCity(), request.getCountry());
        
        // Generate suggestions based on weather, time of day, and occasion
        return generateContextualOutfitSuggestions(request, weather);
    }

    public OutfitSuggestionResponse generateOutfitSuggestions(OutfitSuggestionRequest request) {
        // For backward compatibility - generate basic suggestions
        List<ClosetItemDTO> items = request.getClosetItems();
        String occasion = request.getOccasion() != null ? request.getOccasion() : "Casual Day Out";
        
        OutfitSuggestionResponse.OutfitSuggestion suggestion1 = new OutfitSuggestionResponse.OutfitSuggestion(
            "White Cotton T-Shirt with Blue Denim Jeans and White Sneakers",
            occasion,
            "A classic, comfortable combination perfect for everyday wear. The neutral colors work well together and the outfit is versatile for various activities.",
            items.size() >= 3 ? Arrays.asList(items.get(0).getId(), items.get(1).getId(), items.get(2).getId()) : 
                Arrays.asList(items.get(0).getId())
        );

        OutfitSuggestionResponse.OutfitSuggestion suggestion2 = new OutfitSuggestionResponse.OutfitSuggestion(
            "Black Leather Jacket with Black Trousers and Brown Loafers",
            "Evening Event",
            "A sophisticated look that balances edgy and elegant. The leather jacket adds personality while the trousers keep it polished.",
            items.size() >= 3 ? Arrays.asList(items.get(1).getId(), items.get(2).getId(), items.get(0).getId()) : 
                Arrays.asList(items.get(0).getId())
        );

        OutfitSuggestionResponse.OutfitSuggestion suggestion3 = new OutfitSuggestionResponse.OutfitSuggestion(
            "Gray Hoodie with Denim Shorts and White Sneakers",
            "Weekend Relaxation",
            "Perfect for a laid-back weekend. The hoodie provides comfort while the shorts keep you cool, and sneakers complete the casual vibe.",
            items.size() >= 3 ? Arrays.asList(items.get(2).getId(), items.get(0).getId(), items.get(1).getId()) : 
                Arrays.asList(items.get(0).getId())
        );

        return new OutfitSuggestionResponse(Arrays.asList(suggestion1, suggestion2, suggestion3));
    }

    private OutfitSuggestionResponse generateContextualOutfitSuggestions(WeatherBasedOutfitRequest request, Map<String, Object> weather) {
        List<ClosetItemDTO> items = request.getClosetItems();
        String occasion = request.getOccasion();
        List<String> timesOfDay = request.getTimesOfDay();
        
        // Extract weather information
        double temperature = (Double) weather.getOrDefault("temperature", 20.0);
        String condition = (String) weather.getOrDefault("condition", "clear");
        String description = (String) weather.getOrDefault("description", "clear sky");
        
        // Generate weather-appropriate suggestions
        OutfitSuggestionResponse.OutfitSuggestion suggestion1 = generateWeatherAppropriateOutfit(
            items, occasion, timesOfDay, temperature, condition, description, 1
        );
        
        OutfitSuggestionResponse.OutfitSuggestion suggestion2 = generateWeatherAppropriateOutfit(
            items, occasion, timesOfDay, temperature, condition, description, 2
        );
        
        OutfitSuggestionResponse.OutfitSuggestion suggestion3 = generateWeatherAppropriateOutfit(
            items, occasion, timesOfDay, temperature, condition, description, 3
        );

        return new OutfitSuggestionResponse(Arrays.asList(suggestion1, suggestion2, suggestion3));
    }

    private OutfitSuggestionResponse.OutfitSuggestion generateWeatherAppropriateOutfit(
            List<ClosetItemDTO> items, String occasion, List<String> timesOfDay, 
            double temperature, String condition, String description, int variant) {
        
        String timeContext = timesOfDay != null && !timesOfDay.isEmpty() ? 
            String.join(" and ", timesOfDay).toLowerCase() : "day";
        
        String outfitName;
        String reasoning;
        
        if (temperature < 10) {
            // Cold weather outfit
            outfitName = getColdWeatherOutfit(variant);
            reasoning = String.format(
                "Perfect for cold weather (%.1f°C) with %s conditions. This outfit will keep you warm and stylish for your %s %s event.",
                temperature, description, timeContext, occasion.toLowerCase()
            );
        } else if (temperature > 25) {
            // Hot weather outfit
            outfitName = getHotWeatherOutfit(variant);
            reasoning = String.format(
                "Ideal for warm weather (%.1f°C) with %s conditions. Light and breathable fabrics perfect for your %s %s event.",
                temperature, description, timeContext, occasion.toLowerCase()
            );
        } else {
            // Moderate weather outfit
            outfitName = getModerateWeatherOutfit(variant);
            reasoning = String.format(
                "Great for pleasant weather (%.1f°C) with %s conditions. Comfortable and versatile for your %s %s event.",
                temperature, description, timeContext, occasion.toLowerCase()
            );
        }
        
        // Add rain consideration
        if (condition.toLowerCase().contains("rain")) {
            reasoning += " Consider bringing a waterproof jacket or umbrella.";
        }
        
        // Select appropriate items from closet
        List<Long> selectedItemIds = selectItemsForWeather(items, temperature, condition, variant);
        
        return new OutfitSuggestionResponse.OutfitSuggestion(
            outfitName, occasion, reasoning, selectedItemIds
        );
    }

    private String getColdWeatherOutfit(int variant) {
        String[] outfits = {
            "Wool Sweater with Dark Jeans, Warm Coat and Boots",
            "Layered Look: Long-sleeve Shirt, Cardigan, Scarf and Warm Pants",
            "Thermal Top with Thick Jacket, Warm Trousers and Winter Shoes"
        };
        return outfits[(variant - 1) % outfits.length];
    }

    private String getHotWeatherOutfit(int variant) {
        String[] outfits = {
            "Light Cotton T-Shirt with Shorts and Breathable Sneakers",
            "Linen Shirt with Light Pants and Comfortable Sandals",
            "Sleeveless Top with Flowing Skirt and Open-toe Shoes"
        };
        return outfits[(variant - 1) % outfits.length];
    }

    private String getModerateWeatherOutfit(int variant) {
        String[] outfits = {
            "Cotton Shirt with Jeans and Comfortable Shoes",
            "Light Sweater with Chinos and Casual Sneakers",
            "Blouse with Trousers and Stylish Flats"
        };
        return outfits[(variant - 1) % outfits.length];
    }

    private List<Long> selectItemsForWeather(List<ClosetItemDTO> items, double temperature, String condition, int variant) {
        // Simple selection logic - in a real implementation, this would be more sophisticated
        if (items.size() >= 3) {
            int offset = (variant - 1) % items.size();
            return Arrays.asList(
                items.get(offset % items.size()).getId(),
                items.get((offset + 1) % items.size()).getId(),
                items.get((offset + 2) % items.size()).getId()
            );
        } else if (!items.isEmpty()) {
            return Arrays.asList(items.get(0).getId());
        }
        return Arrays.asList();
    }
}