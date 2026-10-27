package com.example.HireHub.repo;

import com.example.HireHub.model.MyUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MyUserRepo extends JpaRepository<MyUser, Integer> {


    Optional<MyUser> findByUsername(String username);
}
