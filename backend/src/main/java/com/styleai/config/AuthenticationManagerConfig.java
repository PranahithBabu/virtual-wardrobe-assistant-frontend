package com.styleai.config;

import com.styleai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;

import jakarta.annotation.PostConstruct;

/**
 * Configuration to inject AuthenticationManager into UserService
 * after all beans are created to avoid circular dependency
 */
@Configuration
public class AuthenticationManagerConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Inject AuthenticationManager into UserService after bean creation
     * This breaks the circular dependency by delaying the injection
     */
    @PostConstruct
    public void configureAuthenticationManager() {
        userService.setAuthenticationManager(authenticationManager);
    }
}