package com.beautician.bookingsystem.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingRequest {
    @NotNull(message = "Beautician is required")
    private Long beauticianId;

    @NotNull(message = "Service is required")
    private Long serviceId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
}
