package com.td.dms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long postId;

    @NotBlank(message = "댓글 내용은 필수 입력값입니다.")
    private String content;
}
