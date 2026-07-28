package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.VendorDto;
import com.example.eventbooking.dto.response.VendorDashboardStatsDto;
import com.example.eventbooking.entity.ServiceRequest;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.repository.ServiceRepository;
import com.example.eventbooking.repository.ServiceRequestRepository;
import com.example.eventbooking.repository.VendorRepository;
import com.example.eventbooking.service.VendorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorProfileController {

    private final VendorProfileService vendorProfileService;
    private final VendorRepository vendorRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/profile")
    public ResponseEntity<VendorDto> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(vendorProfileService.getOrCreateVendorProfile(currentUser.getUserId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<VendorDto> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody VendorDto dto) {
        return ResponseEntity.ok(vendorProfileService.updateVendorProfile(currentUser.getUserId(), dto));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<VendorDashboardStatsDto> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        // Get or create vendor profile
        vendorProfileService.getOrCreateVendorProfile(currentUser.getUserId());
        Vendor vendor = vendorRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        long totalServices = serviceRepository.findByVendorId(vendor.getId()).size();

        List<ServiceRequest> allRequests = serviceRequestRepository
                .findByServiceVendorIdOrderByCreatedAtDesc(vendor.getId());

        long pendingRequests = allRequests.stream()
                .filter(r -> "Pending".equalsIgnoreCase(r.getStatus()))
                .count();
        long activeRequests = allRequests.stream()
                .filter(r -> "Active".equalsIgnoreCase(r.getStatus()) || "Confirmed".equalsIgnoreCase(r.getStatus()))
                .count();

        BigDecimal totalRevenue = allRequests.stream()
                .filter(r -> "Completed".equalsIgnoreCase(r.getStatus()))
                .map(r -> r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<VendorDashboardStatsDto.RecentRequestDto> recentRequests = allRequests.stream()
                .limit(5)
                .map(r -> VendorDashboardStatsDto.RecentRequestDto.builder()
                        .id("REQ-" + String.format("%03d", r.getId()))
                        .client(r.getClient() != null ? r.getClient().getFullName() : "Unknown")
                        .service(r.getService() != null ? r.getService().getServiceName() : "Unknown")
                        .eventDate(r.getEventDate() != null ? r.getEventDate().toString() : "")
                        .amount(r.getAmount())
                        .status(r.getStatus())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(VendorDashboardStatsDto.builder()
                .totalServices(totalServices)
                .pendingRequests(pendingRequests)
                .activeRequests(activeRequests)
                .totalRevenue(totalRevenue)
                .recentRequests(recentRequests)
                .build());
    }
}

