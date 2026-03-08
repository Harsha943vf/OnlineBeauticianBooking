package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByBookingId(Long bookingId);
}
