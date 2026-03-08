package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.AppointmentDTO;
import com.beautician.bookingsystem.dto.AppointmentRequest;
import com.beautician.bookingsystem.dto.BookingDTO;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Appointment;
import com.beautician.bookingsystem.model.Booking;
import com.beautician.bookingsystem.repository.AppointmentRepository;
import com.beautician.bookingsystem.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BookingRepository bookingRepository;

    public AppointmentDTO createAppointment(AppointmentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Appointment appointment = Appointment.builder()
                .booking(booking)
                .description(request.getDescription())
                .appointmentDate(request.getAppointmentDate())
                .issuedBy(request.getIssuedBy())
                .build();

        appointment = appointmentRepository.save(appointment);
        return toDTO(appointment);
    }

    public AppointmentDTO updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setDescription(request.getDescription());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setIssuedBy(request.getIssuedBy());

        appointment = appointmentRepository.save(appointment);
        return toDTO(appointment);
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(this::toDTO).toList();
    }

    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return toDTO(appointment);
    }

    public AppointmentDTO getByBookingId(Long bookingId) {
        Appointment appointment = appointmentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for this booking"));
        return toDTO(appointment);
    }

    private AppointmentDTO toDTO(Appointment a) {
        Booking b = a.getBooking();
        BookingDTO bookingDTO = BookingDTO.builder()
                .id(b.getId())
                .clientId(b.getClient().getId())
                .clientName(b.getClient().getUsername())
                .beauticianId(b.getBeautician().getId())
                .beauticianName(b.getBeautician().getUser().getUsername())
                .serviceId(b.getService().getId())
                .serviceName(b.getService().getServiceName())
                .bookingDate(b.getBookingDate())
                .bookingTime(b.getBookingTime())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .build();

        return AppointmentDTO.builder()
                .id(a.getId())
                .bookingId(b.getId())
                .description(a.getDescription())
                .appointmentDate(a.getAppointmentDate())
                .issuedBy(a.getIssuedBy())
                .booking(bookingDTO)
                .build();
    }
}
