package com.styleai.controller;

import com.styleai.dto.ClosetItemDTO;
import com.styleai.service.ClosetItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/closet-items")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class ClosetItemController {

    @Autowired
    private ClosetItemService closetItemService;

    @GetMapping
    public ResponseEntity<List<ClosetItemDTO>> getAllItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String season) {
        
        List<ClosetItemDTO> items;
        if (category != null || color != null || season != null) {
            items = closetItemService.getItemsByFilters(category, color, season);
        } else {
            items = closetItemService.getAllItems();
        }
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClosetItemDTO> getItemById(@PathVariable Long id) {
        return closetItemService.getItemById(id)
                .map(item -> ResponseEntity.ok(item))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClosetItemDTO> createItem(@Valid @RequestBody ClosetItemDTO itemDTO) {
        ClosetItemDTO createdItem = closetItemService.createItem(itemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClosetItemDTO> updateItem(@PathVariable Long id, @Valid @RequestBody ClosetItemDTO itemDTO) {
        return closetItemService.updateItem(id, itemDTO)
                .map(item -> ResponseEntity.ok(item))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (closetItemService.deleteItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/filters/categories")
    public ResponseEntity<List<String>> getDistinctCategories() {
        return ResponseEntity.ok(closetItemService.getDistinctCategories());
    }

    @GetMapping("/filters/colors")
    public ResponseEntity<List<String>> getDistinctColors() {
        return ResponseEntity.ok(closetItemService.getDistinctColors());
    }

    @GetMapping("/filters/seasons")
    public ResponseEntity<List<String>> getDistinctSeasons() {
        return ResponseEntity.ok(closetItemService.getDistinctSeasons());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<ClosetItemDTO> allItems = closetItemService.getAllItems();
        
        Map<String, Long> categoryCount = allItems.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    ClosetItemDTO::getCategory,
                    java.util.stream.Collectors.counting()
                ));

        Map<String, Object> stats = Map.of(
            "totalItems", allItems.size(),
            "categoryCount", categoryCount.entrySet().stream()
                .map(entry -> Map.of("name", entry.getKey(), "count", entry.getValue()))
                .collect(java.util.stream.Collectors.toList())
        );

        return ResponseEntity.ok(stats);
    }
}