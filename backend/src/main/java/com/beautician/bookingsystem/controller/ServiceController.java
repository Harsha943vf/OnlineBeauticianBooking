package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.ServiceDTO;
import com.beautician.bookingsystem.dto.ServiceRequest;
import com.beautician.bookingsystem.service.BeautyServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final BeautyServiceService beautyServiceService;

    @PostMapping("/beautician/{beauticianId}")
    public ResponseEntity<ServiceDTO> addService(@PathVariable Long beauticianId,
                                                  @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(beautyServiceService.addService(beauticianId, request));
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceDTO> updateService(@PathVariable Long serviceId,
                                                     @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(beautyServiceService.updateService(serviceId, request));
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId) {
        beautyServiceService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/beautician/{beauticianId}")
    public ResponseEntity<List<ServiceDTO>> getServicesByBeautician(@PathVariable Long beauticianId) {
        return ResponseEntity.ok(beautyServiceService.getServicesByBeautician(beauticianId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDTO> getService(@PathVariable Long id) {
        return ResponseEntity.ok(beautyServiceService.getServiceById(id));
    }
}
