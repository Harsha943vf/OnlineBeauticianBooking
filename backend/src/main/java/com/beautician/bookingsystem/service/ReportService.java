package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.ReportDTO;
import com.beautician.bookingsystem.dto.ReportRequest;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Appointment;
import com.beautician.bookingsystem.model.Report;
import com.beautician.bookingsystem.repository.AppointmentRepository;
import com.beautician.bookingsystem.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final AppointmentRepository appointmentRepository;

    public ReportDTO createReport(ReportRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        Report report = Report.builder()
                .appointment(appointment)
                .amount(request.getAmount())
                .reportDetails(request.getReportDetails())
                .createdBy(request.getCreatedBy())
                .build();

        report = reportRepository.save(report);
        return toDTO(report);
    }

    public ReportDTO updateReport(Long id, ReportRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setAmount(request.getAmount());
        report.setReportDetails(request.getReportDetails());
        report.setCreatedBy(request.getCreatedBy());

        report = reportRepository.save(report);
        return toDTO(report);
    }

    public ReportDTO getByAppointmentId(Long appointmentId) {
        Report report = reportRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found for this appointment"));
        return toDTO(report);
    }

    private ReportDTO toDTO(Report r) {
        return ReportDTO.builder()
                .id(r.getId())
                .appointmentId(r.getAppointment().getId())
                .amount(r.getAmount())
                .reportDetails(r.getReportDetails())
                .createdBy(r.getCreatedBy())
                .createdDate(r.getCreatedDate())
                .build();
    }
}
