package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.BookingDTO;
import com.beautician.bookingsystem.dto.BookingRequest;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.*;
import com.beautician.bookingsystem.model.enums.BookingStatus;
import com.beautician.bookingsystem.repository.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BeauticianRepository beauticianRepository;
    private final BeautyServiceRepository serviceRepository;
    private final EmailService emailService;

    public BookingDTO createBooking(Long clientId, BookingRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Beautician beautician = beauticianRepository.findById(request.getBeauticianId())
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));

        BeautyService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        // Check for conflicting booking (only one booking per time slot)
        boolean conflict = bookingRepository
                .existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                        request.getBeauticianId(),
                        request.getBookingDate(),
                        request.getBookingTime(),
                        BookingStatus.CANCELLED);

        if (conflict) {
            throw new BadRequestException("This time slot is already booked");
        }

        Booking booking = Booking.builder()
                .client(client)
                .beautician(beautician)
                .service(service)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .notes(request.getNotes())
                .clientPhone(client.getMobileNumber())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(
                client.getEmail(), client.getUsername(),
                beautician.getUser().getUsername(), service.getServiceName(),
                booking.getBookingDate().toString(), booking.getBookingTime().toString());
        return toDTO(booking);
    }

    public BookingDTO cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking = bookingRepository.save(booking);
        emailService.sendBookingCancellation(
                booking.getClient().getEmail(), booking.getClient().getUsername(),
                booking.getService().getServiceName(),
                booking.getBookingDate().toString(), booking.getBookingTime().toString(), reason);
        return toDTO(booking);
    }

    public BookingDTO rescheduleBooking(Long bookingId, BookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean conflict = bookingRepository
                .existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                        booking.getBeautician().getId(),
                        request.getBookingDate(),
                        request.getBookingTime(),
                        BookingStatus.CANCELLED);

        if (conflict) {
            throw new BadRequestException("This time slot is already booked");
        }

        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);
        return toDTO(booking);
    }

    public BookingDTO approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.APPROVED);
        booking = bookingRepository.save(booking);
        emailService.sendBookingStatusUpdate(
                booking.getClient().getEmail(), booking.getClient().getUsername(),
                booking.getService().getServiceName(), "APPROVED");
        return toDTO(booking);
    }

    public BookingDTO rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.REJECTED);
        booking = bookingRepository.save(booking);
        return toDTO(booking);
    }

    public BookingDTO completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        return toDTO(booking);
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return toDTO(booking);
    }

    public List<BookingDTO> getClientBookings(Long clientId) {
        return bookingRepository.findByClientId(clientId)
                .stream().map(this::toDTO).toList();
    }

    public List<BookingDTO> getBeauticianBookings(Long beauticianId) {
        return bookingRepository.findByBeauticianId(beauticianId)
                .stream().map(this::toDTO).toList();
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::toDTO).toList();
    }

    public boolean hasCompletedBooking(Long clientId, Long beauticianId) {
        return !bookingRepository.findByClientIdAndBeauticianIdAndStatus(
                clientId, beauticianId, BookingStatus.COMPLETED).isEmpty();
    }

    private BookingDTO toDTO(Booking b) {
        return BookingDTO.builder()
                .id(b.getId())
                .clientId(b.getClient().getId())
                .clientName(b.getClient().getUsername())
                .beauticianId(b.getBeautician().getId())
                .beauticianName(b.getBeautician().getUser().getUsername())
                .serviceId(b.getService().getId())
                .serviceName(b.getService().getServiceName())
                .servicePrice(b.getService().getPrice())
                .serviceDuration(b.getService().getDurationMinutes())
                .bookingDate(b.getBookingDate())
                .bookingTime(b.getBookingTime())
                .status(b.getStatus())
                .notes(b.getNotes())
                .clientPhone(b.getClientPhone())
                .clientEmail(b.getClient().getEmail())
                .cancellationReason(b.getCancellationReason())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
