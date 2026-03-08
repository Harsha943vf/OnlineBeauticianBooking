package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.AvailabilitySlotDTO;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.AvailabilitySlot;
import com.beautician.bookingsystem.model.Beautician;
import com.beautician.bookingsystem.repository.AvailabilitySlotRepository;
import com.beautician.bookingsystem.repository.BeauticianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilitySlotService {

    private final AvailabilitySlotRepository slotRepository;
    private final BeauticianRepository beauticianRepository;

    public AvailabilitySlotDTO addSlot(Long beauticianId, AvailabilitySlotDTO request) {
        Beautician beautician = beauticianRepository.findById(beauticianId)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));

        AvailabilitySlot slot = AvailabilitySlot.builder()
                .beautician(beautician)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .available(true)
                .build();

        slot = slotRepository.save(slot);
        return toDTO(slot);
    }

    public AvailabilitySlotDTO updateSlot(Long slotId, AvailabilitySlotDTO request) {
        AvailabilitySlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setAvailable(request.isAvailable());

        slot = slotRepository.save(slot);
        return toDTO(slot);
    }

    public void deleteSlot(Long slotId) {
        if (!slotRepository.existsById(slotId)) {
            throw new ResourceNotFoundException("Slot not found");
        }
        slotRepository.deleteById(slotId);
    }

    public List<AvailabilitySlotDTO> getSlotsByBeautician(Long beauticianId) {
        return slotRepository.findByBeauticianId(beauticianId)
                .stream().map(this::toDTO).toList();
    }

    public List<AvailabilitySlotDTO> getAvailableSlots(Long beauticianId) {
        return slotRepository.findByBeauticianIdAndAvailableTrue(beauticianId)
                .stream().map(this::toDTO).toList();
    }

    private AvailabilitySlotDTO toDTO(AvailabilitySlot s) {
        return AvailabilitySlotDTO.builder()
                .id(s.getId())
                .beauticianId(s.getBeautician().getId())
                .date(s.getDate())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .available(s.isAvailable())
                .build();
    }
}
