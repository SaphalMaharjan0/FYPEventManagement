package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

import com.example.eventbooking.dto.response.AuthResponse;
import com.example.eventbooking.dto.request.LoginRequest;
import com.example.eventbooking.dto.request.RegisterRequest;
import com.example.eventbooking.entity.Role;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.example.eventbooking.service.EmailService emailService;
    private final com.example.eventbooking.repository.PasswordResetTokenRepository tokenRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.customer;

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(userRole)
                .isActive(true)
                .build();
                
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserDto.builder()
                        .userId(user.getUserId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .location(user.getLocation())
                        .role(user.getRole())
                        .isSuperAdmin(user.isSuperAdmin())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserDto.builder()
                        .userId(user.getUserId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .location(user.getLocation())
                        .role(user.getRole())
                        .isSuperAdmin(user.isSuperAdmin())
                        .build())
                .build();
    }
    public void generatePasswordResetToken(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            System.out.println("⚠️ FORGOT PASSWORD: User not found for email: " + email);
            return;
        }

        // Delete any existing token for this user
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        String token = java.util.UUID.randomUUID().toString();
        
        com.example.eventbooking.entity.PasswordResetToken resetToken = new com.example.eventbooking.entity.PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(30));
        
        tokenRepository.save(resetToken);
        
        System.out.println("\n=======================================================");
        System.out.println("🔑 PASSWORD RESET TOKEN GENERATED FOR: " + email);
        System.out.println("🔗 RESET LINK: http://localhost:5173/reset-password?token=" + token);
        System.out.println("=======================================================\n");

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String newPassword) {
        var resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
