package com.styleai.service;

import com.styleai.dto.PlannedEventDTO;
import com.styleai.entity.PlannedEvent;
import com.styleai.repository.PlannedEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlannedEventService {

    @Autowired
    private PlannedEventRepository plannedEventRepository;

    public List<PlannedEventDTO> getAllEvents() {
        return plannedEventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PlannedEventDTO> getEventById(Long id) {
        return plannedEventRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<PlannedEventDTO> getEventsByDate(LocalDate date) {
        return plannedEventRepository.findByDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PlannedEventDTO> getEventsByDateRange(LocalDate startDate, LocalDate endDate) {
        return plannedEventRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PlannedEventDTO createEvent(PlannedEventDTO eventDTO) {
        PlannedEvent event = convertToEntity(eventDTO);
        PlannedEvent savedEvent = plannedEventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    public Optional<PlannedEventDTO> updateEvent(Long id, PlannedEventDTO eventDTO) {
        return plannedEventRepository.findById(id)
                .map(existingEvent -> {
                    updateEntityFromDTO(existingEvent, eventDTO);
                    PlannedEvent savedEvent = plannedEventRepository.save(existingEvent);
                    return convertToDTO(savedEvent);
                });
    }

    public boolean deleteEvent(Long id) {
        if (plannedEventRepository.existsById(id)) {
            plannedEventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean canModifyEvent(Long id) {
        Optional<PlannedEvent> event = plannedEventRepository.findById(id);
        if (event.isPresent()) {
            LocalDate eventDate = event.get().getDate();
            LocalDate today = LocalDate.now();
            return !eventDate.isBefore(today);
        }
        return false;
    }

    private PlannedEventDTO convertToDTO(PlannedEvent event) {
        PlannedEventDTO dto = new PlannedEventDTO();
        dto.setId(event.getId());
        dto.setDate(event.getDate());
        dto.setOccasion(event.getOccasion());
        dto.setOutfitId(event.getOutfitId());
        dto.setTimesOfDay(event.getTimesOfDay());
        return dto;
    }

    private PlannedEvent convertToEntity(PlannedEventDTO dto) {
        PlannedEvent event = new PlannedEvent();
        event.setDate(dto.getDate());
        event.setOccasion(dto.getOccasion());
        event.setOutfitId(dto.getOutfitId());
        event.setTimesOfDay(dto.getTimesOfDay());
        return event;
    }

    private void updateEntityFromDTO(PlannedEvent event, PlannedEventDTO dto) {
        event.setDate(dto.getDate());
        event.setOccasion(dto.getOccasion());
        event.setOutfitId(dto.getOutfitId());
        event.setTimesOfDay(dto.getTimesOfDay());
    }
}