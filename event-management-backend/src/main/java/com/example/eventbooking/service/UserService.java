package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.AuthResponse.UserDto;
import com.example.eventbooking.dto.request.UpdateProfileRequest;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto updateProfile(Integer userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail().trim()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim());
        }

        userRepository.save(user);

        return UserDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .location(user.getLocation())
                .role(user.getRole())
                .build();
    }

    public void changePassword(Integer userId, com.example.eventbooking.dto.request.ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
