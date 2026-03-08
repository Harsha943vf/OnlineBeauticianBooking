package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.*;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Beautician;
import com.beautician.bookingsystem.model.User;
import com.beautician.bookingsystem.model.enums.Role;
import com.beautician.bookingsystem.repository.BeauticianRepository;
import com.beautician.bookingsystem.repository.UserRepository;
import com.beautician.bookingsystem.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BeauticianRepository beauticianRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobileNumber(request.getMobileNumber())
                .country(request.getCountry())
                .role(request.getRole() != null ? request.getRole() : Role.CLIENT)
                .active(true)
                .build();

        user = userRepository.save(user);

        if (user.getRole() == Role.BEAUTICIAN) {
            Beautician beautician = Beautician.builder()
                    .user(user)
                    .salonName(user.getUsername() + "'s Salon")
                    .ratingAverage(0.0)
                    .build();
            beauticianRepository.save(beautician);
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name()))
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String input = request.getUsernameOrEmail();
        User user = userRepository.findByUsername(input)
                .or(() -> userRepository.findByEmail(input))
                .orElseThrow(() -> new BadRequestException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username/email or password");
        }

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated");
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name()))
                .message("Login successful")
                .build();
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDTO(user);
    }

    public UserDTO updateUser(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setCountry(request.getCountry());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user = userRepository.save(user);
        return toDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream().map(this::toDTO).toList();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .country(user.getCountry())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
