package com.td.dms.service;

import org.springframework.stereotype.Service;

import com.td.dms.dto.LoginRequest;
import com.td.dms.dto.SignupRequest;
import com.td.dms.entity.Role;
import com.td.dms.entity.User;
import com.td.dms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.mindrot.jbcrypt.BCrypt;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void registerUser(SignupRequest request) {
        // 비밀번호 암호화
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(hashedPassword);
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public void login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
    }
}
