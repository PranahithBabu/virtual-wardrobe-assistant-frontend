package com.styleai.controller;

import com.styleai.dto.AIAnalysisResponse;
import com.styleai.dto.AIImageAnalysisRequest;
import com.styleai.dto.AIImageGenerationResponse;
import com.styleai.dto.AITextToImageRequest;
import com.styleai.service.GeminiAIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai-enhanced")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class AIEnhancedController {

    @Autowired
    private GeminiAIService geminiAIService;

    @PostMapping("/analyze-clothing-image")
    public ResponseEntity<AIAnalysisResponse> analyzeClothingImage(@Valid @RequestBody AIImageAnalysisRequest request) {
        try {
            AIAnalysisResponse response = geminiAIService.analyzeClothingImage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate-clothing-image")
    public ResponseEntity<AIImageGenerationResponse> generateClothingImage(@Valid @RequestBody AITextToImageRequest request) {
        try {
            AIImageGenerationResponse response = geminiAIService.generateClothingImage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/analyze-text")
    public ResponseEntity<AIAnalysisResponse> analyzeTextForClothing(@RequestParam String itemName) {
        try {
            AIAnalysisResponse response = geminiAIService.analyzeTextForClothing(itemName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}