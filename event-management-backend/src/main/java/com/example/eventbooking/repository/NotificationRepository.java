package com.example.eventbooking.repository;

import com.example.eventbooking.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByRecipientUserUserIdOrderByCreatedAtDesc(Integer userId);

    long countByRecipientUserUserIdAndIsReadFalse(Integer userId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipientUser.userId = :userId AND n.isRead = false")
    void markAllAsReadByUserId(Integer userId);
}
