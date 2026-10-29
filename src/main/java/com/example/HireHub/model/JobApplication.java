package com.example.HireHub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_post_id", "username"})
)
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_app_seq")
    @SequenceGenerator(name = "job_app_seq", sequenceName = "job_app_seq", initialValue = 1, allocationSize = 1)
    private Integer id;

    @Column(name = "job_post_id", nullable = false)
    private Integer jobPostId;

    @Column(name = "job_profile")
    private String jobProfile;

    @Column(nullable = false)
    private String username;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
    }
}
