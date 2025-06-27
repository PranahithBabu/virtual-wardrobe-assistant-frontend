package com.styleai.service;

import com.styleai.dto.UserProfileDTO;
import com.styleai.entity.UserProfile;
import com.styleai.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<UserProfileDTO> getAllProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserProfileDTO> getProfileById(Long id) {
        return userProfileRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<UserProfileDTO> getProfileByEmail(String email) {
        return userProfileRepository.findByEmail(email)
                .map(this::convertToDTO);
    }

    public UserProfileDTO createProfile(UserProfileDTO profileDTO) {
        UserProfile profile = convertToEntity(profileDTO);
        UserProfile savedProfile = userProfileRepository.save(profile);
        return convertToDTO(savedProfile);
    }

    public Optional<UserProfileDTO> updateProfile(Long id, UserProfileDTO profileDTO) {
        return userProfileRepository.findById(id)
                .map(existingProfile -> {
                    updateEntityFromDTO(existingProfile, profileDTO);
                    UserProfile savedProfile = userProfileRepository.save(existingProfile);
                    return convertToDTO(savedProfile);
                });
    }

    public boolean deleteProfile(Long id) {
        if (userProfileRepository.existsById(id)) {
            userProfileRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public UserProfileDTO getOrCreateDefaultProfile() {
        Optional<UserProfileDTO> profile = getProfileByEmail("alex.doe@example.com");
        if (profile.isPresent()) {
            return profile.get();
        }
        
        // Create default profile
        UserProfileDTO defaultProfile = new UserProfileDTO();
        defaultProfile.setName("Alex Doe");
        defaultProfile.setEmail("alex.doe@example.com");
        defaultProfile.setAvatarUrl("https://placehold.co/100x100.png");
        defaultProfile.setStylePreferences("I love a minimalist style with neutral colors. I occasionally like to add a pop of color with accessories. My go-to look is casual chic.");
        
        return createProfile(defaultProfile);
    }

    private UserProfileDTO convertToDTO(UserProfile profile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(profile.getId());
        dto.setName(profile.getName());
        dto.setEmail(profile.getEmail());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setStylePreferences(profile.getStylePreferences());
        return dto;
    }

    private UserProfile convertToEntity(UserProfileDTO dto) {
        UserProfile profile = new UserProfile();
        profile.setName(dto.getName());
        profile.setEmail(dto.getEmail());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setStylePreferences(dto.getStylePreferences());
        return profile;
    }

    private void updateEntityFromDTO(UserProfile profile, UserProfileDTO dto) {
        profile.setName(dto.getName());
        profile.setEmail(dto.getEmail());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setStylePreferences(dto.getStylePreferences());
    }
}