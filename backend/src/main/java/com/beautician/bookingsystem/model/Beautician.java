package com.beautician.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beauticians")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Beautician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String salonName;

    private String specialization;

    private Integer experienceYears;

    @Column(length = 1000)
    private String description;

    private Double ratingAverage = 0.0;
}
