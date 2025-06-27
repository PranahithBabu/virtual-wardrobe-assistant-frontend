package com.styleai.repository;

import com.styleai.entity.PlannedEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlannedEventRepository extends JpaRepository<PlannedEvent, Long> {
    
    List<PlannedEvent> findByDate(LocalDate date);
    
    List<PlannedEvent> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<PlannedEvent> findByOutfitId(Long outfitId);
}