package com.styleai.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "planned_events")
public class PlannedEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Occasion is required")
    @Column(nullable = false)
    private String occasion;

    @NotNull(message = "Outfit ID is required")
    @Column(name = "outfit_id", nullable = false)
    private Long outfitId;

    @ElementCollection
    @CollectionTable(name = "event_times", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "time_of_day")
    private List<String> timesOfDay;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public PlannedEvent() {}

    public PlannedEvent(LocalDate date, String occasion, Long outfitId, List<String> timesOfDay) {
        this.date = date;
        this.occasion = occasion;
        this.outfitId = outfitId;
        this.timesOfDay = timesOfDay;
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}