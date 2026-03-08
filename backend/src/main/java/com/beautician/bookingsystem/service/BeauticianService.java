package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.BeauticianDTO;
import com.beautician.bookingsystem.dto.BeauticianRequest;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Beautician;
import com.beautician.bookingsystem.model.User;
import com.beautician.bookingsystem.model.enums.Role;
import com.beautician.bookingsystem.repository.BeauticianRepository;
import com.beautician.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeauticianService {

    private final BeauticianRepository beauticianRepository;
    private final UserRepository userRepository;

    public BeauticianDTO createProfile(Long userId, BeauticianRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.BEAUTICIAN) {
            throw new BadRequestException("User is not registered as a beautician");
        }

        if (beauticianRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Beautician profile already exists");
        }

        Beautician beautician = Beautician.builder()
                .user(user)
                .salonName(request.getSalonName())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears())
                .description(request.getDescription())
                .ratingAverage(0.0)
                .build();

        beautician = beauticianRepository.save(beautician);
        return toDTO(beautician);
    }

    public BeauticianDTO updateProfile(Long id, BeauticianRequest request) {
        Beautician beautician = beauticianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));

        beautician.setSalonName(request.getSalonName());
        beautician.setSpecialization(request.getSpecialization());
        beautician.setExperienceYears(request.getExperienceYears());
        beautician.setDescription(request.getDescription());

        beautician = beauticianRepository.save(beautician);
        return toDTO(beautician);
    }

    public BeauticianDTO getById(Long id) {
        Beautician beautician = beauticianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));
        return toDTO(beautician);
    }

    public BeauticianDTO getByUserId(Long userId) {
        Beautician beautician = beauticianRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician profile not found"));
        return toDTO(beautician);
    }

    public List<BeauticianDTO> getAll() {
        return beauticianRepository.findAll().stream().map(this::toDTO).toList();
    }

    public void updateRating(Long beauticianId, double newAverage) {
        Beautician beautician = beauticianRepository.findById(beauticianId)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));
        beautician.setRatingAverage(newAverage);
        beauticianRepository.save(beautician);
    }

    private BeauticianDTO toDTO(Beautician b) {
        return BeauticianDTO.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .username(b.getUser().getUsername())
                .email(b.getUser().getEmail())
                .salonName(b.getSalonName())
                .specialization(b.getSpecialization())
                .experienceYears(b.getExperienceYears())
                .description(b.getDescription())
                .ratingAverage(b.getRatingAverage())
                .build();
    }
}
