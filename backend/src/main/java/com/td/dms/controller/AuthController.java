package com.td.dms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import jakarta.validation.Valid;

import com.td.dms.dto.LoginRequest;
import com.td.dms.dto.SignupRequest;
import com.td.dms.service.UserService;
import com.td.dms.util.JwtUtil;
import com.td.dms.dto.LoginResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody @Valid SignupRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("회원가입 성공!");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        userService.login(request);
        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
}
