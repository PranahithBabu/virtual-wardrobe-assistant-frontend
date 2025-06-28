package com.styleai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class PlannedEventDTO {
    private Long id;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotBlank(message = "Occasion is required")
    private String occasion;
    
    @NotNull(message = "Outfit ID is required")
    private Long outfitId;

    private List<String> timesOfDay;

    // Constructors
    public PlannedEventDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public Long getOutfitId() { return outfitId; }
    public void setOutfitId(Long outfitId) { this.outfitId = outfitId; }

    public List<String> getTimesOfDay() { return timesOfDay; }
    public void setTimesOfDay(List<String> timesOfDay) { this.timesOfDay = timesOfDay; }
}