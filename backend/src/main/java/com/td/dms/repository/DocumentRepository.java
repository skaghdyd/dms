package com.td.dms.repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import com.td.dms.entity.Document;
import com.td.dms.entity.User;
import com.td.dms.entity.Folder;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    // 사용자별 문서 조회
    List<Document> findByCreatedBy(User createdBy);

    // 폴더별 문서 조회
    List<Document> findByFolder(Folder folder);

    // 중요 문서 조회
    List<Document> findByIsStarredTrue();

    // 최근 문서 조회 (최근 30일)
    List<Document> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);

    // 폴더별 문서 조회
    List<Document> findByFolderAndCreatedBy(Folder folder, User createdBy);

    // 중요 문서 조회
    List<Document> findByIsStarredTrueAndCreatedBy(User createdBy);

    // 최근 문서 조회 (최근 30일)
    List<Document> findByCreatedByAndCreatedAtAfterOrderByCreatedAtDesc(
            User createdBy,
            LocalDateTime date);

    // 폴더 내 문서 수 조회
    long countByFolder(Folder folder);
}
