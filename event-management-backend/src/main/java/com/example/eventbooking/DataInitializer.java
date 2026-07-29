package com.example.eventbooking;

import com.example.eventbooking.entity.Event;
import com.example.eventbooking.entity.Role;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.enums.EventStatus;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, EventRepository eventRepository) {
        return args -> {
            // Auto-publish existing draft events so they show up on the events page
            eventRepository.findAll().forEach(e -> {
                if (e.getStatus() == EventStatus.draft) {
                    e.setStatus(EventStatus.published);
                    eventRepository.save(e);
                }
            });

            if (eventRepository.count() == 0) {
                // Ensure there is an organizer
                User admin = userRepository.findByEmail("admin@example.com").orElseGet(() -> {
                    User newUser = User.builder()
                            .fullName("Admin User")
                            .email("admin@example.com")
                            .passwordHash("$2a$10$dummyHash...") // dummy
                            .phone("1234567890")
                            .role(Role.administrator)
                            .isSuperAdmin(true)
                            .isActive(true)
                            .build();
                    return userRepository.save(newUser);
                });

                Event event1 = Event.builder()
                        .organizer(admin)
                        .title("Global Tech Summit 2026")
                        .description("A massive tech summit bringing together the brightest minds in the industry.")
                        .category("Technology")
                        .venue("Kathmandu Tech Park")
                        .eventDate(LocalDate.of(2026, 10, 15))
                        .startTime(LocalTime.of(9, 0))
                        .endTime(LocalTime.of(17, 0))
                        .capacity(500)
                        .status(EventStatus.published)
                        .build();

                Event event2 = Event.builder()
                        .organizer(admin)
                        .title("Nepal Music Festival")
                        .description("The biggest live music festival featuring top bands from around the country.")
                        .category("Music")
                        .venue("Tudikhel Ground")
                        .eventDate(LocalDate.of(2026, 11, 5))
                        .startTime(LocalTime.of(16, 0))
                        .endTime(LocalTime.of(23, 0))
                        .capacity(2000)
                        .status(EventStatus.published)
                        .build();

                Event event3 = Event.builder()
                        .organizer(admin)
                        .title("Art & Design Expo")
                        .description("A brilliant exhibition of contemporary arts and designs.")
                        .category("Arts")
                        .venue("Nepal Art Council")
                        .eventDate(LocalDate.of(2026, 12, 10))
                        .startTime(LocalTime.of(10, 0))
                        .endTime(LocalTime.of(18, 0))
                        .capacity(300)
                        .status(EventStatus.published)
                        .build();

                Event event4 = Event.builder()
                        .organizer(admin)
                        .title("Startup Pitch Fest")
                        .description("Watch aspiring entrepreneurs pitch their startups to top investors.")
                        .category("Business")
                        .venue("Everest Hotel")
                        .eventDate(LocalDate.of(2026, 9, 20))
                        .startTime(LocalTime.of(11, 0))
                        .endTime(LocalTime.of(15, 0))
                        .capacity(150)
                        .status(EventStatus.published)
                        .build();

                eventRepository.saveAll(List.of(event1, event2, event3, event4));
            }
        };
    }
}
