package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.EventDto;
import com.example.eventbooking.entity.Event;
import com.example.eventbooking.entity.enums.EventStatus;
import com.example.eventbooking.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDto> getAllPublishedEvents() {
        return eventRepository.findByStatus(EventStatus.published)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private EventDto mapToDto(Event event) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        double dummyPrice = 50.0;
        String dummyImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000";
        int totalSeats = event.getCapacity();
        int seatsLeft = event.getCapacity();
        int percentAvailable = (totalSeats > 0) ? (seatsLeft * 100 / totalSeats) : 0;
        boolean featured = event.getEventId() % 2 != 0; 

        return EventDto.builder()
                .id(event.getEventId())
                .title(event.getTitle())
                .category(event.getCategory())
                .date(event.getEventDate().format(dateFormatter))
                .time(event.getStartTime().format(timeFormatter))
                .venue(event.getVenue())
                .price(dummyPrice)
                .image(dummyImage)
                .organizer(event.getOrganizer().getFullName())
                .totalSeats(totalSeats)
                .seatsLeft(seatsLeft)
                .percentAvailable(percentAvailable)
                .featured(featured)
                .description(event.getDescription())
                .build();
    }
}
