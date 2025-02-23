package com.td.dms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderResponse {
    private Long id;
    private String name;
    private int documentCount;
}