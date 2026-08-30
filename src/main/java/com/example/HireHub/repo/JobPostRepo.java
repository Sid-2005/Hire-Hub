package com.example.HireHub.repo;

import com.example.HireHub.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface JobPostRepo extends JpaRepository<JobPost,Integer> {
    List<JobPost> searchByPostId(Integer postId);

    @Query("SELECT DISTINCT j FROM JobPost j LEFT JOIN j.postTechStack t " +
           "WHERE LOWER(j.postProfile) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.postDesc) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(t) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<JobPost> searchByKeyword(@Param("keyword") String keyword);

    List<JobPost> findByReqExperience(Integer reqExperience);

    @Query("SELECT DISTINCT j FROM JobPost j JOIN j.postTechStack t " +
           "WHERE LOWER(t) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<JobPost> findByTechStack(@Param("skill") String skill);
}
