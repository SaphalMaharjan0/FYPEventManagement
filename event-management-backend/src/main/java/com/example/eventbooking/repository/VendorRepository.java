package com.example.eventbooking.repository;

import com.example.eventbooking.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {
    @org.springframework.data.jpa.repository.Query("SELECT v FROM Vendor v WHERE v.user.userId = :userId")
    Optional<Vendor> findByUserId(@org.springframework.data.repository.query.Param("userId") Integer userId);
}
