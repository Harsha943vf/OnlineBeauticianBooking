package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.AvailabilitySlotDTO;
import com.beautician.bookingsystem.service.AvailabilitySlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AvailabilityController {

    private final AvailabilitySlotService slotService;

    @PostMapping("/beautician/{beauticianId}")
    public ResponseEntity<AvailabilitySlotDTO> addSlot(@PathVariable Long beauticianId,
                                                        @RequestBody AvailabilitySlotDTO request) {
        return ResponseEntity.ok(slotService.addSlot(beauticianId, request));
    }

    @PutMapping("/{slotId}")
    public ResponseEntity<AvailabilitySlotDTO> updateSlot(@PathVariable Long slotId,
                                                           @RequestBody AvailabilitySlotDTO request) {
        return ResponseEntity.ok(slotService.updateSlot(slotId, request));
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/beautician/{beauticianId}")
    public ResponseEntity<List<AvailabilitySlotDTO>> getSlots(@PathVariable Long beauticianId) {
        return ResponseEntity.ok(slotService.getSlotsByBeautician(beauticianId));
    }

    @GetMapping("/beautician/{beauticianId}/available")
    public ResponseEntity<List<AvailabilitySlotDTO>> getAvailableSlots(@PathVariable Long beauticianId) {
        return ResponseEntity.ok(slotService.getAvailableSlots(beauticianId));
    }
}
