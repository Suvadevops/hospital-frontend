package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hospital.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
