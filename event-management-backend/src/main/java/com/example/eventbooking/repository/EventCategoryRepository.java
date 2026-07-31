package com.example.eventbooking.repository;

import com.example.eventbooking.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventCategoryRepository extends JpaRepository<EventCategory, Integer> {
    Optional<EventCategory> findBySlug(String slug);
}
