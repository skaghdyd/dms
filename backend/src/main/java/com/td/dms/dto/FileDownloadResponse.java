package com.td.dms.dto;

import org.springframework.core.io.Resource;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class FileDownloadResponse {
    private String fileName;
    private String contentType;
    private Resource resource;

}
