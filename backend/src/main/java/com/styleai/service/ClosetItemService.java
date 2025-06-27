package com.styleai.service;

import com.styleai.dto.ClosetItemDTO;
import com.styleai.entity.ClosetItem;
import com.styleai.repository.ClosetItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClosetItemService {

    @Autowired
    private ClosetItemRepository closetItemRepository;

    public List<ClosetItemDTO> getAllItems() {
        return closetItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ClosetItemDTO> getItemById(Long id) {
        return closetItemRepository.findById(id)
                .map(this::convertToDTO);
    }

    public ClosetItemDTO createItem(ClosetItemDTO itemDTO) {
        ClosetItem item = convertToEntity(itemDTO);
        ClosetItem savedItem = closetItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public Optional<ClosetItemDTO> updateItem(Long id, ClosetItemDTO itemDTO) {
        return closetItemRepository.findById(id)
                .map(existingItem -> {
                    updateEntityFromDTO(existingItem, itemDTO);
                    ClosetItem savedItem = closetItemRepository.save(existingItem);
                    return convertToDTO(savedItem);
                });
    }

    public boolean deleteItem(Long id) {
        if (closetItemRepository.existsById(id)) {
            closetItemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<ClosetItemDTO> getItemsByFilters(String category, String color, String season) {
        return closetItemRepository.findByFilters(category, color, season).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getDistinctCategories() {
        return closetItemRepository.findDistinctCategories();
    }

    public List<String> getDistinctColors() {
        return closetItemRepository.findDistinctColors();
    }

    public List<String> getDistinctSeasons() {
        return closetItemRepository.findDistinctSeasons();
    }

    private ClosetItemDTO convertToDTO(ClosetItem item) {
        ClosetItemDTO dto = new ClosetItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setColor(item.getColor());
        dto.setSeasons(item.getSeasons());
        dto.setImageUrl(item.getImageUrl());
        dto.setLastWorn(item.getLastWorn());
        dto.setPreviousLastWorn(item.getPreviousLastWorn());
        dto.setDataAiHint(item.getDataAiHint());
        return dto;
    }

    private ClosetItem convertToEntity(ClosetItemDTO dto) {
        ClosetItem item = new ClosetItem();
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setColor(dto.getColor());
        item.setSeasons(dto.getSeasons());
        item.setImageUrl(dto.getImageUrl());
        item.setLastWorn(dto.getLastWorn());
        item.setPreviousLastWorn(dto.getPreviousLastWorn());
        item.setDataAiHint(dto.getDataAiHint());
        return item;
    }

    private void updateEntityFromDTO(ClosetItem item, ClosetItemDTO dto) {
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setColor(dto.getColor());
        item.setSeasons(dto.getSeasons());
        if (dto.getImageUrl() != null) {
            item.setImageUrl(dto.getImageUrl());
        }
        item.setLastWorn(dto.getLastWorn());
        item.setPreviousLastWorn(dto.getPreviousLastWorn());
        item.setDataAiHint(dto.getDataAiHint());
    }
}