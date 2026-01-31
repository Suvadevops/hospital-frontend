package com.example.hospital.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Patient {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;

        private int age;

        private String doctor;

        private LocalDate appointmentDate;

        public Patient() {}

        // getters & setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }

        public String getDoctor() { return doctor; }
        public void setDoctor(String doctor) { this.doctor = doctor; }

        public LocalDate getAppointmentDate() { return appointmentDate; }
        public void setAppointmentDate(LocalDate appointmentDate) {
                this.appointmentDate = appointmentDate;
        }
}
