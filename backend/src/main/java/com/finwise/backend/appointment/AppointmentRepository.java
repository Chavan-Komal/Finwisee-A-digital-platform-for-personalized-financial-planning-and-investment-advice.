package com.finwise.backend.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(Long userId);

    List<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc();

    long countByStatus(Appointment.AppointmentStatus status);

    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.user.id = :userId")
    void deleteAllForUser(@Param("userId") Long userId);
}
