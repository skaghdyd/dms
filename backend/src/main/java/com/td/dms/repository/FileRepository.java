package com.td.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.td.dms.entity.FileEntity;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByDocumentId(Long documentId);
}