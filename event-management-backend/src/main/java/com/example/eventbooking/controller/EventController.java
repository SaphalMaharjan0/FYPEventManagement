package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.EventDto;
import com.example.eventbooking.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllPublishedEvents());
    }
}
