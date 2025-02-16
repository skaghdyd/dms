package com.td.dms.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int viewCount;
    private int commentCount;
    private List<FileResponse> files;
    private List<CommentResponse> recentComments; // 최근 댓글 몇 개만 포함
}
