package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.VendorDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.VendorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorProfileController {

    private final VendorProfileService vendorProfileService;

    @GetMapping
    public ResponseEntity<VendorDto> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(vendorProfileService.getOrCreateVendorProfile(currentUser.getUserId()));
    }

    @PutMapping
    public ResponseEntity<VendorDto> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody VendorDto dto) {
        return ResponseEntity.ok(vendorProfileService.updateVendorProfile(currentUser.getUserId(), dto));
    }
}
