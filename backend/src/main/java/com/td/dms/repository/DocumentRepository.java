package com.td.dms.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.td.dms.entity.Document;
import com.td.dms.entity.User;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCreatedBy(User createdBy);
}
