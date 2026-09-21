package com.finwise.backend.appointment;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    public record AppointmentRequest(
            @NotNull LocalDate appointmentDate,
            @NotNull LocalTime appointmentTime,
            @NotBlank String appointmentType,
            String notes) {}

    private final AppointmentRepository appointmentRepository;
    private final CurrentUserService currentUserService;

    public AppointmentController(AppointmentRepository appointmentRepository, CurrentUserService currentUserService) {
        this.appointmentRepository = appointmentRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/my-appointments")
    public List<Appointment> getMyAppointments(Authentication auth) {
        User user = currentUserService.require(auth);
        return appointmentRepository.findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(user.getId());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id, Authentication auth) {
        Appointment appointment = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), appointment.getUser());
        return appointment;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody AppointmentRequest request, Authentication auth) {
        User user = currentUserService.require(auth);
        if (request.appointmentDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment date cannot be in the past");
        }
        Appointment appointment = new Appointment(user, request.appointmentDate(), request.appointmentTime(), request.appointmentType());
        appointment.setNotes(request.notes());
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentRepository.save(appointment));
    }

    /** Users can cancel their own appointments; admins can cancel any. */
    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointment(@PathVariable Long id, Authentication auth) {
        Appointment appointment = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), appointment.getUser());
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Appointment updateAppointmentStatus(@PathVariable Long id,
                                               @RequestParam Appointment.AppointmentStatus status,
                                               @RequestParam(required = false) String advisorName) {
        Appointment appointment = find(id);
        appointment.setStatus(status);
        if (advisorName != null && !advisorName.isBlank()) {
            appointment.setAdvisorName(advisorName.trim());
        }
        return appointmentRepository.save(appointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, Authentication auth) {
        Appointment appointment = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), appointment.getUser());
        appointmentRepository.delete(appointment);
        return ResponseEntity.noContent().build();
    }

    private Appointment find(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Appointment"));
    }
}
