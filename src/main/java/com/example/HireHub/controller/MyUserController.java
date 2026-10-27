package com.example.HireHub.controller;

import com.example.HireHub.model.MyUser;
import com.example.HireHub.service.JwtService;
import com.example.HireHub.service.MyUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MyUserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUsersService service;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public MyUser register(@RequestBody MyUser user) {

        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody MyUser user) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            if (auth.isAuthenticated()) {
                String role = auth.getAuthorities().stream()
                        .findFirst()
                        .map(GrantedAuthority::getAuthority)
                        .orElse("ROLE_USER");
                if (role.startsWith("ROLE_")) {
                    role = role.substring(5);
                }
                return jwtService.getToken(user.getUsername(), role);
            }
        } catch (AuthenticationException e) {
            return "Fail";
        }

        return "Fail";
    }

}
