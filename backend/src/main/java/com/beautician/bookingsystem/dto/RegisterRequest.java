package com.beautician.bookingsystem.dto;

import com.beautician.bookingsystem.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @NotBlank @Size(min = 3, max = 30, message = "Username must be 3-30 characters")
    private String username;

    @Email(message = "Invalid email format") @NotBlank
    private String email;

    @NotBlank @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Mobile number must be 10-15 digits")
    private String mobileNumber;

    @Size(max = 60)
    private String country;

    private Role role;
}
