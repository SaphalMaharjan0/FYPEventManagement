package com.example.eventbooking.repository;

import com.example.eventbooking.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByEventEventIdOrderByCreatedAtDesc(Integer eventId);
    boolean existsByEventEventIdAndUserUserId(Integer eventId, Integer userId);
}
