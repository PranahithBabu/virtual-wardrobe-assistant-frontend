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

    @PostMapping("/analyze-image")
    public ResponseEntity<AIAnalysisResponse> analyzeImage(@Valid @RequestBody AIAnalysisRequest request) {
        AIAnalysisResponse response = aiService.analyzeImage(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-image")
    public ResponseEntity<AIImageGenerationResponse> generateImage(@Valid @RequestBody AIImageGenerationRequest request) {
        AIImageGenerationResponse response = aiService.generateImage(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/outfit-suggestions")
    public ResponseEntity<OutfitSuggestionResponse> generateOutfitSuggestions(@Valid @RequestBody OutfitSuggestionRequest request) {
        OutfitSuggestionResponse response = aiService.generateOutfitSuggestions(request);
        return ResponseEntity.ok(response);
    }
}