package com.td.dms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PostRequest {
    @NotBlank(message = "제목은 필수 입력값입니다.")
    @Size(max = 255, message = "제목은 255자를 초과할 수 없습니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력값입니다.")
    private String content;

    // 첨부파일 ID 목록 (수정 시 사용)
    private List<Long> fileIds;
}
