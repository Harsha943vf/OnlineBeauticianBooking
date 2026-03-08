package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.Booking;
import com.beautician.bookingsystem.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientId(Long clientId);
    List<Booking> findByBeauticianId(Long beauticianId);
    List<Booking> findByBeauticianIdAndStatus(Long beauticianId, BookingStatus status);
    boolean existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
            Long beauticianId, LocalDate date, LocalTime time, BookingStatus status);
    List<Booking> findByClientIdAndBeauticianIdAndStatus(Long clientId, Long beauticianId, BookingStatus status);
}
