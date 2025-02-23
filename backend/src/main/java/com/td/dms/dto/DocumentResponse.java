package com.td.dms.dto;

import com.td.dms.entity.Document;
import lombok.Getter;
import lombok.Setter;
import com.td.dms.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class DocumentResponse {
    private Long id;
    private String title;
    private String content;
    private Boolean isStarred;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User createdBy;
    private String folderId;
    private List<FileResponse> files;

    // 생성자
    public DocumentResponse(Document document) {
        this.id = document.getId();
        this.title = document.getTitle();
        this.content = document.getContent();
        this.isStarred = document.getIsStarred();
        this.createdAt = document.getCreatedAt();
        this.updatedAt = document.getUpdatedAt();
        this.createdBy = document.getCreatedBy();
        this.folderId = document.getFolder() != null ? document.getFolder().getId().toString() : null;
        this.files = document.getFiles().stream()
                .map(FileResponse::new)
                .collect(Collectors.toList());
    }
}