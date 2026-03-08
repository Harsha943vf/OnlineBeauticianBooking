package com.beautician.bookingsystem.model;

import com.beautician.bookingsystem.model.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 30)
    @Column(unique = true, length = 30)
    private String username;

    @Email @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid mobile number")
    @Column(length = 15)
    private String mobileNumber;

    @Size(max = 60)
    private String country;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
