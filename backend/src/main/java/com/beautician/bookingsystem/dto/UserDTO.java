package com.beautician.bookingsystem.dto;

import com.beautician.bookingsystem.model.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String mobileNumber;
    private String country;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
}
