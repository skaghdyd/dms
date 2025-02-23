package com.td.dms.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class DocumentRequest {
    private String title;
    private String content;
    private Long folderId;
    private Boolean isStarred;
    private List<Long> remainingFileIds;
}
