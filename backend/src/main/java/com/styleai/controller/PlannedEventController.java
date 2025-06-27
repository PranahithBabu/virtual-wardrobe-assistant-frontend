package com.styleai.controller;

import com.styleai.dto.PlannedEventDTO;
import com.styleai.service.PlannedEventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/planned-events")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class PlannedEventController {

    @Autowired
    private PlannedEventService plannedEventService;

    @GetMapping
    public ResponseEntity<List<PlannedEventDTO>> getAllEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<PlannedEventDTO> events;
        if (date != null) {
            events = plannedEventService.getEventsByDate(date);
        } else if (startDate != null && endDate != null) {
            events = plannedEventService.getEventsByDateRange(startDate, endDate);
        } else {
            events = plannedEventService.getAllEvents();
        }
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlannedEventDTO> getEventById(@PathVariable Long id) {
        return plannedEventService.getEventById(id)
                .map(event -> ResponseEntity.ok(event))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlannedEventDTO> createEvent(@Valid @RequestBody PlannedEventDTO eventDTO) {
        PlannedEventDTO createdEvent = plannedEventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlannedEventDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody PlannedEventDTO eventDTO) {
        return plannedEventService.updateEvent(id, eventDTO)
                .map(event -> ResponseEntity.ok(event))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (plannedEventService.deleteEvent(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}