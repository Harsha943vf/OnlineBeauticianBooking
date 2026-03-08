package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.BeautyService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeautyServiceRepository extends JpaRepository<BeautyService, Long> {
    List<BeautyService> findByBeauticianId(Long beauticianId);
}
