package com.example.eventbooking.repository;

import com.example.eventbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_UserId(Integer userId);
    java.util.Optional<Booking> findByTransactionUuid(String transactionUuid);
    List<Booking> findByEvent_EventId(Integer eventId);
}
