package com.beautician.bookingsystem.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentDTO {
    private Long id;
    private Long bookingId;
    private String description;
    private LocalDate appointmentDate;
    private String issuedBy;
    private BookingDTO booking;
}
