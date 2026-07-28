package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.ServiceRequestDto;
import com.example.eventbooking.service.VendorServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendor/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development
public class VendorServiceRequestController {

    private final VendorServiceRequestService requestService;

    @GetMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<List<ServiceRequestDto>> getVendorRequests(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(requestService.getVendorRequests(email));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ServiceRequestDto> updateRequestStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        
        String email = authentication.getName();
        String status = payload.get("status");
        
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status, email));
    }
}
