package com.example.HireHub.repo;

import com.example.HireHub.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface JobPostRepo extends JpaRepository<JobPost,Integer> {
    List<JobPost> searchByPostId(Integer postId);
}
