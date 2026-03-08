package com.beautician.bookingsystem.model;

import com.beautician.bookingsystem.model.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "beautician_id", nullable = false)
    private Beautician beautician;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private BeautyService service;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(length = 500)
    private String notes;

    @Column(length = 15)
    private String clientPhone;

    @Column(length = 500)
    private String cancellationReason;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
