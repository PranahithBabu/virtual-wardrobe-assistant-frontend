package com.styleai.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "closet_items")
public class ClosetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Color is required")
    @Column(nullable = false)
    private String color;

    @ElementCollection
    @CollectionTable(name = "item_seasons", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "season")
    private List<String> seasons;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "last_worn")
    private LocalDate lastWorn;

    @Column(name = "previous_last_worn")
    private LocalDate previousLastWorn;

    @Column(name = "data_ai_hint")
    private String dataAiHint;

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
    public ClosetItem() {}

    public ClosetItem(String name, String category, String color, List<String> seasons) {
        this.name = name;
        this.category = category;
        this.color = color;
        this.seasons = seasons;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getSeasons() { return seasons; }
    public void setSeasons(List<String> seasons) { this.seasons = seasons; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDate getLastWorn() { return lastWorn; }
    public void setLastWorn(LocalDate lastWorn) { this.lastWorn = lastWorn; }

    public LocalDate getPreviousLastWorn() { return previousLastWorn; }
    public void setPreviousLastWorn(LocalDate previousLastWorn) { this.previousLastWorn = previousLastWorn; }

    public String getDataAiHint() { return dataAiHint; }
    public void setDataAiHint(String dataAiHint) { this.dataAiHint = dataAiHint; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}