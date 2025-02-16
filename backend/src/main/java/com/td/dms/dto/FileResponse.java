package com.td.dms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileResponse {
    private Long id;
    private String originalFileName;
    private Long fileSize;
}