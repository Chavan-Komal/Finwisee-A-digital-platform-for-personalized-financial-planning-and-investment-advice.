package com.finwise.backend.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByUserIdOrderByAppointmentDateDesc(Long userId);
    
    List<Appointment> findByUserIdAndStatusOrderByAppointmentDateDesc(Long userId, Appointment.AppointmentStatus status);
    
    List<Appointment> findByStatusOrderByAppointmentDateAsc(Appointment.AppointmentStatus status);
}
