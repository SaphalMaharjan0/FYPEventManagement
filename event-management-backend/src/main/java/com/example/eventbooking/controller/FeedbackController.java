package com.example.eventbooking.controller;

import com.example.eventbooking.dto.FeedbackDto;
import com.example.eventbooking.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/{eventId}/feedback")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Integer eventId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        try {
            Integer rating = (Integer) payload.get("rating");
            String comment = (String) payload.get("comment");
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(Map.of("message", "Rating must be between 1 and 5"));
            }
            FeedbackDto feedback = feedbackService.addFeedback(eventId, authentication.getName(), rating, comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Could not submit feedback"));
        }
    }

    @GetMapping("/{eventId}/feedback")
    public ResponseEntity<List<FeedbackDto>> getFeedback(@PathVariable Integer eventId) {
        List<FeedbackDto> feedbackList = feedbackService.getFeedbackForEvent(eventId);
        return ResponseEntity.ok(feedbackList);
    }
}
