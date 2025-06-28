package com.styleai.controller;

import com.styleai.dto.AuthRequest;
import com.styleai.dto.AuthResponse;
import com.styleai.dto.SignUpRequest;
import com.styleai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles user registration and login endpoints
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:9002", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * User registration endpoint
     * 
     * @param signUpRequest User registration data
     * @return AuthResponse with JWT token and user details
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            AuthResponse response = userService.signUp(signUpRequest);
            
            // Ensure response is not null and has required fields
            if (response == null || response.getToken() == null || response.getEmail() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Signup error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // Log unexpected errors
            System.err.println("Unexpected signup error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * User login endpoint
     * 
     * @param authRequest User login credentials
     * @return AuthResponse with JWT token and user details
     */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = userService.signIn(authRequest);
            
            // Ensure response is not null and has required fields
            if (response == null || response.getToken() == null || response.getEmail() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Signin error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            // Log unexpected errors
            System.err.println("Unexpected signin error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}