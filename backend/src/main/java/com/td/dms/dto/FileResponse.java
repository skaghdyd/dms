package com.td.dms.dto;

import com.td.dms.entity.FileEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileResponse {
    private Long id;
    private String originalFileName;
    private Long fileSize;

    public FileResponse(Long id, String originalFileName, Long fileSize) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
    }

    public FileResponse(FileEntity file) {
        this.id = file.getId();
        this.originalFileName = file.getOriginalFileName();
        this.fileSize = file.getFileSize();
    }
}