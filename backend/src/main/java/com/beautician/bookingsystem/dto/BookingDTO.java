package com.beautician.bookingsystem.dto;

import com.beautician.bookingsystem.model.enums.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long beauticianId;
    private String beauticianName;
    private Long serviceId;
    private String serviceName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private String notes;
    private String clientPhone;
    private String clientEmail;
    private Double servicePrice;
    private Integer serviceDuration;
    private String cancellationReason;
    private LocalDateTime createdAt;
}
