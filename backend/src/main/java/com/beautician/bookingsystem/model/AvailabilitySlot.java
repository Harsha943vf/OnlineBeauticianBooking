package com.beautician.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "availability_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "beautician_id", nullable = false)
    private Beautician beautician;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private boolean available = true;
}
