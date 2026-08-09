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
import org.springframework.cache.annotation.Cacheable;

import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.TicketRepository;
import com.example.eventbooking.entity.Ticket;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    public List<EventDto> getAllEventsDebug() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Cacheable("events")
    public List<EventDto> getAllPublishedEvents() {
        // Log the count of all events in the database to see what's going on
        System.out.println("Total events in DB: " + eventRepository.count());
        
        return eventRepository.findByStatus(EventStatus.published)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private EventDto mapToDto(Event event) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<Ticket> tickets = ticketRepository.findByEventEventId(event.getEventId());
        double actualPrice = tickets.isEmpty() ? 50.0 : tickets.get(0).getPrice().doubleValue();
        String dummyImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000";
        String actualImage = (event.getImageUrl() != null && !event.getImageUrl().trim().isEmpty()) 
                                ? event.getImageUrl() : dummyImage;
        int totalSeats = event.getCapacity();
        int bookedTickets = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(com.example.eventbooking.entity.Booking::getTicketCount)
                .sum();
        int seatsLeft = Math.max(0, totalSeats - bookedTickets);
        int percentAvailable = (totalSeats > 0) ? (seatsLeft * 100 / totalSeats) : 0;
        boolean featured = event.getEventId() % 2 != 0; 

        return EventDto.builder()
                .id(event.getEventId())
                .title(event.getTitle())
                .category(event.getCategory())
                .date(event.getEventDate().format(dateFormatter))
                .time(event.getStartTime().format(timeFormatter))
                .venue(event.getVenue())
                .price(actualPrice)
                .currency(event.getCurrency() != null ? event.getCurrency() : "USD")
                .image(actualImage)
                .imageUrl(actualImage)
                .organizer(event.getOrganizer().getFullName())
                .totalSeats(totalSeats)
                .seatsLeft(seatsLeft)
                .percentAvailable(percentAvailable)
                .featured(featured)
                .description(event.getDescription())
                .build();
    }
}
