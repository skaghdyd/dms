package com.td.dms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    @Size(min = 4, message = "아이디는 4자 이상이어야 합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Size(min = 6, message = "비밀번호는 6자 이상이어야 합니다.")
    private String password;
}