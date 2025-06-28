package com.styleai.controller;

import com.styleai.dto.*;
import com.styleai.service.AIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/outfit-suggestions")
    public ResponseEntity<OutfitSuggestionResponse> generateOutfitSuggestions(@Valid @RequestBody OutfitSuggestionRequest request) {
        OutfitSuggestionResponse response = aiService.generateOutfitSuggestions(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/weather-based-suggestions")
    public ResponseEntity<OutfitSuggestionResponse> generateWeatherBasedOutfitSuggestions(@Valid @RequestBody WeatherBasedOutfitRequest request) {
        OutfitSuggestionResponse response = aiService.generateWeatherBasedOutfitSuggestions(request);
        return ResponseEntity.ok(response);
    }
}