package com.finwise.backend.appointment;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getMyAppointments(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Appointment> appointments = appointmentRepository.findByUserIdOrderByAppointmentDateDesc(user.getId());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @appointmentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> ResponseEntity.ok().body(appointment))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setUser(user);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @appointmentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @Valid @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                    appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                    appointment.setAppointmentType(appointmentDetails.getAppointmentType());
                    appointment.setStatus(appointmentDetails.getStatus());
                    appointment.setAdvisorName(appointmentDetails.getAdvisorName());
                    appointment.setNotes(appointmentDetails.getNotes());
                    return ResponseEntity.ok(appointmentRepository.save(appointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @appointmentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointmentRepository.delete(appointment);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam Appointment.AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return ResponseEntity.ok(appointmentRepository.save(appointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(appointments);
    }
}
