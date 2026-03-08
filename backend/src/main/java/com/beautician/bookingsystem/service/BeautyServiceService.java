package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.ServiceDTO;
import com.beautician.bookingsystem.dto.ServiceRequest;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Beautician;
import com.beautician.bookingsystem.model.BeautyService;
import com.beautician.bookingsystem.repository.BeauticianRepository;
import com.beautician.bookingsystem.repository.BeautyServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeautyServiceService {

    private final BeautyServiceRepository serviceRepository;
    private final BeauticianRepository beauticianRepository;

    public ServiceDTO addService(Long beauticianId, ServiceRequest request) {
        Beautician beautician = beauticianRepository.findById(beauticianId)
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));

        BeautyService service = BeautyService.builder()
                .beautician(beautician)
                .serviceName(request.getServiceName())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .price(request.getPrice())
                .build();

        service = serviceRepository.save(service);
        return toDTO(service);
    }

    public ServiceDTO updateService(Long serviceId, ServiceRequest request) {
        BeautyService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());

        service = serviceRepository.save(service);
        return toDTO(service);
    }

    public void deleteService(Long serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new ResourceNotFoundException("Service not found");
        }
        serviceRepository.deleteById(serviceId);
    }

    public List<ServiceDTO> getServicesByBeautician(Long beauticianId) {
        return serviceRepository.findByBeauticianId(beauticianId)
                .stream().map(this::toDTO).toList();
    }

    public ServiceDTO getServiceById(Long id) {
        BeautyService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return toDTO(service);
    }

    private ServiceDTO toDTO(BeautyService s) {
        return ServiceDTO.builder()
                .id(s.getId())
                .beauticianId(s.getBeautician().getId())
                .beauticianName(s.getBeautician().getUser().getUsername())
                .serviceName(s.getServiceName())
                .description(s.getDescription())
                .durationMinutes(s.getDurationMinutes())
                .price(s.getPrice())
                .build();
    }
}
