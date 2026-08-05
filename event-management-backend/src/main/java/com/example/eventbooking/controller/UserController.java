package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.AuthResponse.UserDto;
import com.example.eventbooking.dto.request.UpdateProfileRequest;
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

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User currentUser,
            @RequestBody com.example.eventbooking.dto.request.ChangePasswordRequest request) {
        userService.changePassword(currentUser.getUserId(), request);
        return ResponseEntity.ok().build();
    }
}
