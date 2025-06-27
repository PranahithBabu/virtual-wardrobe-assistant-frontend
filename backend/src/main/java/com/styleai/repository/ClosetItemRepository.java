package com.styleai.repository;

import com.styleai.entity.ClosetItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClosetItemRepository extends JpaRepository<ClosetItem, Long> {
    
    List<ClosetItem> findByCategory(String category);
    
    List<ClosetItem> findByColor(String color);
    
    @Query("SELECT c FROM ClosetItem c JOIN c.seasons s WHERE s = :season")
    List<ClosetItem> findBySeason(@Param("season") String season);
    
    @Query("SELECT c FROM ClosetItem c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:color IS NULL OR c.color = :color) AND " +
           "(:season IS NULL OR :season MEMBER OF c.seasons)")
    List<ClosetItem> findByFilters(@Param("category") String category, 
                                  @Param("color") String color, 
                                  @Param("season") String season);
    
    @Query("SELECT DISTINCT c.category FROM ClosetItem c ORDER BY c.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT c.color FROM ClosetItem c ORDER BY c.color")
    List<String> findDistinctColors();
    
    @Query("SELECT DISTINCT s FROM ClosetItem c JOIN c.seasons s ORDER BY s")
    List<String> findDistinctSeasons();
}