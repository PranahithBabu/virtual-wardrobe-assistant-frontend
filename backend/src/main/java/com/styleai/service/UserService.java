package com.styleai.service;

import com.styleai.dto.AuthRequest;
import com.styleai.dto.AuthResponse;
import com.styleai.dto.SignUpRequest;
import com.styleai.entity.User;
import com.styleai.repository.UserRepository;
import com.styleai.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

/**
 * User Service implementing UserDetailsService for Spring Security
 * 
 * This service handles user authentication, registration, and user details loading.
 * 
 * IMPORTANT: To break circular dependency, this service uses @Lazy injection
 * for AuthenticationManager, which is only needed for sign-in operations.
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    
    // Lazy injection to break circular dependency
    private AuthenticationManager authenticationManager;

    /**
     * Constructor injection for core dependencies
     * AuthenticationManager is injected separately to avoid circular dependency
     */
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Setter injection for AuthenticationManager to break circular dependency
     * This is called after all beans are created
     */
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Load user by username (email) for Spring Security
     * This method is used by DaoAuthenticationProvider
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    /**
     * User registration
     */
    public AuthResponse signUp(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setAvatarUrl(signUpRequest.getAvatarUrl());
        user.setStylePreferences(signUpRequest.getStylePreferences());
        user.setCountry(signUpRequest.getCountry());
        user.setCity(signUpRequest.getCity());

        User savedUser = userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(savedUser.getEmail());

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getAvatarUrl(),
                savedUser.getStylePreferences(),
                savedUser.getCountry(),
                savedUser.getCity()
        );
    }

    /**
     * User authentication
     * Uses AuthenticationManager for credential validation
     */
    public AuthResponse signIn(AuthRequest authRequest) {
        // Ensure AuthenticationManager is available
        if (authenticationManager == null) {
            throw new RuntimeException("Authentication manager not initialized");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        String jwt = jwtUtils.generateJwtToken(authRequest.getEmail());

        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getStylePreferences(),
                user.getCountry(),
                user.getCity()
        );
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String email, User userDetails) {
        User user = getCurrentUser(email);
        
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getAvatarUrl() != null) {
            user.setAvatarUrl(userDetails.getAvatarUrl());
        }
        if (userDetails.getStylePreferences() != null) {
            user.setStylePreferences(userDetails.getStylePreferences());
        }
        if (userDetails.getCountry() != null) {
            user.setCountry(userDetails.getCountry());
        }
        if (userDetails.getCity() != null) {
            user.setCity(userDetails.getCity());
        }
        
        return userRepository.save(user);
    }
}