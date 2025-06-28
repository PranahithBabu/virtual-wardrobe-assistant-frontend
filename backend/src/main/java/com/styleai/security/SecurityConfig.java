package com.styleai.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.styleai.service.UserService;

import java.util.Arrays;

/**
 * Security Configuration for JWT-based authentication
 * 
 * This configuration breaks circular dependencies by:
 * 1. Creating beans in the correct order
 * 2. Using method parameters for dependency injection
 * 3. Avoiding field injection in security components
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    /**
     * Password encoder bean - created first with no dependencies
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * JWT Utils bean - created early with no dependencies
     */
    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils();
    }

    /**
     * Authentication Manager - created from Spring's configuration
     * This is needed for manual authentication in UserService
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Authentication Provider - depends on UserService and PasswordEncoder
     * UserService is injected by Spring automatically as UserDetailsService
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    /**
     * JWT Authentication Filter - created with explicit dependencies
     * This breaks the circular dependency by not autowiring UserService directly
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtils jwtUtils, UserService userService) {
        return new JwtAuthenticationFilter(jwtUtils, userService);
    }

    /**
     * Security Filter Chain Configuration
     */
    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http, 
            DaoAuthenticationProvider authenticationProvider,
            JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        
        http.cors().and().csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // Allow H2 console access in dev
                .anyRequest().authenticated()
            );

        // Configure authentication provider
        http.authenticationProvider(authenticationProvider);
        
        // Add JWT filter before username/password authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Enable H2 console for development (disable frame options)
        http.headers().frameOptions().disable();

        return http.build();
    }

    /**
     * CORS Configuration Source
     * Note: This is separate from CorsConfig to avoid bean name conflicts
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}