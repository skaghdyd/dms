package com.td.dms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileUploadResponse {
    private Long id;
    private String fileName;
    private Long fileSize;
    private String fileType;
}