package com.beautician.bookingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BeautyService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "beautician_id", nullable = false)
    private Beautician beautician;

    @NotBlank
    private String serviceName;

    @Column(length = 500)
    private String description;

    @Positive
    private Integer durationMinutes;

    @Positive
    private Double price;
}
