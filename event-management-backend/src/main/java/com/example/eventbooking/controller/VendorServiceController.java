package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.ServiceDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.VendorServiceListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorServiceController {

    private final VendorServiceListingService serviceListingService;

    @GetMapping
    public ResponseEntity<List<ServiceDto>> getServices(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(serviceListingService.getServicesByUserId(currentUser.getUserId()));
    }

    @PostMapping
    public ResponseEntity<ServiceDto> createService(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ServiceDto dto) {
        return ResponseEntity.ok(serviceListingService.createService(currentUser.getUserId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceDto> updateService(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Integer id,
            @RequestBody ServiceDto dto) {
        return ResponseEntity.ok(serviceListingService.updateService(currentUser.getUserId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Integer id) {
        serviceListingService.deleteService(currentUser.getUserId(), id);
        return ResponseEntity.noContent().build();
    }
}
