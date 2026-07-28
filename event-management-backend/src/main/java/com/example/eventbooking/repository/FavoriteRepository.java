package com.example.eventbooking.repository;

import com.example.eventbooking.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser_UserId(Integer userId);
    Optional<Favorite> findByUser_UserIdAndEvent_EventId(Integer userId, Integer eventId);
    boolean existsByUser_UserIdAndEvent_EventId(Integer userId, Integer eventId);
}
