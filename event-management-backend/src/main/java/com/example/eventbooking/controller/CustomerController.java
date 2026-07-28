package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.CustomerDashboardStatsDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.eventbooking.dto.request.EsewaInitiateRequest;
import com.example.eventbooking.dto.response.EsewaInitiateResponse;


@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<CustomerDashboardStatsDto> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        CustomerDashboardStatsDto stats = customerService.getDashboardStats(currentUser.getUserId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/bookings")
    public ResponseEntity<java.util.List<com.example.eventbooking.dto.response.CustomerBookingDto>> getBookings(@AuthenticationPrincipal User currentUser) {
        java.util.List<com.example.eventbooking.dto.response.CustomerBookingDto> bookings = customerService.getUserBookings(currentUser.getUserId());
        return ResponseEntity.ok(bookings);
    }

    @org.springframework.web.bind.annotation.PostMapping("/favorites/{eventId}")
    public ResponseEntity<java.util.Map<String, Boolean>> toggleFavorite(@AuthenticationPrincipal User currentUser, @org.springframework.web.bind.annotation.PathVariable Integer eventId) {
        boolean isFavorited = customerService.toggleFavorite(currentUser.getUserId(), eventId);
        java.util.Map<String, Boolean> response = new java.util.HashMap<>();
        response.put("isFavorited", isFavorited);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<java.util.List<CustomerDashboardStatsDto.EventDto>> getFavorites(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(customerService.getFavoriteEvents(currentUser.getUserId()));
    }

    @PostMapping("/bookings/initiate-esewa")
    public ResponseEntity<EsewaInitiateResponse> initiateEsewa(@AuthenticationPrincipal User currentUser, @RequestBody EsewaInitiateRequest request) {
        return ResponseEntity.ok(customerService.initiateEsewaBooking(currentUser.getUserId(), request));
    }

    @GetMapping("/bookings/esewa-callback")
    public ResponseEntity<java.util.Map<String, Boolean>> verifyEsewa(@RequestParam("data") String base64Data) {
        boolean success = customerService.verifyEsewaPayment(base64Data);
        java.util.Map<String, Boolean> res = new java.util.HashMap<>();
        res.put("success", success);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<java.util.Map<String, String>> cancelBooking(@AuthenticationPrincipal User currentUser, @org.springframework.web.bind.annotation.PathVariable Long bookingId) {
        customerService.cancelBooking(currentUser.getUserId(), bookingId);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Booking cancelled successfully");
        return ResponseEntity.ok(response);
    }
}
