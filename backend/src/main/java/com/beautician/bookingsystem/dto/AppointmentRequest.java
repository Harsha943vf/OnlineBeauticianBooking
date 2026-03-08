package com.beautician.bookingsystem.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentRequest {
    private Long bookingId;
    private String description;
    private LocalDate appointmentDate;
    private String issuedBy;
}
