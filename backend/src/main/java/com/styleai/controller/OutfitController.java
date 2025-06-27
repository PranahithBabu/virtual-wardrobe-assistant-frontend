package com.styleai.controller;

import com.styleai.dto.OutfitDTO;
import com.styleai.service.OutfitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/outfits")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class OutfitController {

    @Autowired
    private OutfitService outfitService;

    @GetMapping
    public ResponseEntity<List<OutfitDTO>> getAllOutfits() {
        List<OutfitDTO> outfits = outfitService.getAllOutfits();
        return ResponseEntity.ok(outfits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutfitDTO> getOutfitById(@PathVariable Long id) {
        return outfitService.getOutfitById(id)
                .map(outfit -> ResponseEntity.ok(outfit))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OutfitDTO> createOutfit(@Valid @RequestBody OutfitDTO outfitDTO) {
        OutfitDTO createdOutfit = outfitService.createOutfit(outfitDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOutfit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OutfitDTO> updateOutfit(@PathVariable Long id, @Valid @RequestBody OutfitDTO outfitDTO) {
        return outfitService.updateOutfit(id, outfitDTO)
                .map(outfit -> ResponseEntity.ok(outfit))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutfit(@PathVariable Long id) {
        if (outfitService.deleteOutfit(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}