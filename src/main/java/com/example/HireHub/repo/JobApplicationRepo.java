package com.example.HireHub.repo;

import com.example.HireHub.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplication, Integer> {

    List<JobApplication> findByJobPostId(Integer jobPostId);

    List<JobApplication> findByUsername(String username);

    Optional<JobApplication> findByJobPostIdAndUsername(Integer jobPostId, String username);

    boolean existsByJobPostIdAndUsername(Integer jobPostId, String username);

    long countByJobPostId(Integer jobPostId);
}
