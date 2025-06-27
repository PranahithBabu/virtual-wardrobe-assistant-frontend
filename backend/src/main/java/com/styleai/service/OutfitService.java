package com.styleai.service;

import com.styleai.dto.OutfitDTO;
import com.styleai.entity.Outfit;
import com.styleai.repository.OutfitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OutfitService {

    @Autowired
    private OutfitRepository outfitRepository;

    public List<OutfitDTO> getAllOutfits() {
        return outfitRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<OutfitDTO> getOutfitById(Long id) {
        return outfitRepository.findById(id)
                .map(this::convertToDTO);
    }

    public OutfitDTO createOutfit(OutfitDTO outfitDTO) {
        Outfit outfit = convertToEntity(outfitDTO);
        Outfit savedOutfit = outfitRepository.save(outfit);
        return convertToDTO(savedOutfit);
    }

    public Optional<OutfitDTO> updateOutfit(Long id, OutfitDTO outfitDTO) {
        return outfitRepository.findById(id)
                .map(existingOutfit -> {
                    updateEntityFromDTO(existingOutfit, outfitDTO);
                    Outfit savedOutfit = outfitRepository.save(existingOutfit);
                    return convertToDTO(savedOutfit);
                });
    }

    public boolean deleteOutfit(Long id) {
        if (outfitRepository.existsById(id)) {
            outfitRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private OutfitDTO convertToDTO(Outfit outfit) {
        OutfitDTO dto = new OutfitDTO();
        dto.setId(outfit.getId());
        dto.setName(outfit.getName());
        dto.setItemIds(outfit.getItemIds());
        dto.setReasoning(outfit.getReasoning());
        return dto;
    }

    private Outfit convertToEntity(OutfitDTO dto) {
        Outfit outfit = new Outfit();
        outfit.setName(dto.getName());
        outfit.setItemIds(dto.getItemIds());
        outfit.setReasoning(dto.getReasoning());
        return outfit;
    }

    private void updateEntityFromDTO(Outfit outfit, OutfitDTO dto) {
        outfit.setName(dto.getName());
        outfit.setItemIds(dto.getItemIds());
        outfit.setReasoning(dto.getReasoning());
    }
}