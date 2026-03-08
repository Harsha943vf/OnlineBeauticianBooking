package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBeauticianId(Long beauticianId);
    boolean existsByClientIdAndBeauticianId(Long clientId, Long beauticianId);
}
