package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

import com.example.eventbooking.dto.FeedbackDto;
import com.example.eventbooking.entity.Event;
import com.example.eventbooking.entity.Feedback;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.FeedbackRepository;
import com.example.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public FeedbackDto addFeedback(Integer eventId, String email, Integer rating, String comment) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (feedbackRepository.existsByEventEventIdAndUserUserId(eventId, user.getUserId())) {
            throw new IllegalStateException("User has already submitted feedback for this event.");
        }

        Feedback feedback = Feedback.builder()
                .event(event)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        return mapToDto(saved);
    }

    public List<FeedbackDto> getFeedbackForEvent(Integer eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found");
        }
        return feedbackRepository.findByEventEventIdOrderByCreatedAtDesc(eventId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private FeedbackDto mapToDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .eventId(feedback.getEvent().getEventId())
                .userId(feedback.getUser().getUserId())
                .userName(feedback.getUser().getFullName())
                .userEmail(feedback.getUser().getEmail())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
