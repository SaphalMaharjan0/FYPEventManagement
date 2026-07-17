package com.example.eventbooking.controller;

import com.example.eventbooking.dto.AuthResponse.UserDto;
import com.example.eventbooking.dto.UpdateProfileRequest;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateProfileRequest request) {
        
        UserDto updatedUser = userService.updateProfile(currentUser.getUserId(), request);
        return ResponseEntity.ok(updatedUser);
    }
}
