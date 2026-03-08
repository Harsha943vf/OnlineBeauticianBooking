package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByBeauticianId(Long beauticianId);
    List<AvailabilitySlot> findByBeauticianIdAndDate(Long beauticianId, LocalDate date);
    List<AvailabilitySlot> findByBeauticianIdAndAvailableTrue(Long beauticianId);
}
