package com.td.dms.repository;

import com.td.dms.entity.Folder;
import com.td.dms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByCreatedBy(User user);

    Optional<Folder> findByIdAndCreatedBy(Long id, User user);

    Boolean existsByNameAndCreatedBy(String name, User user);

    @Query("SELECT f.id, f.name, COUNT(d) as documentCount " +
            "FROM Folder f LEFT JOIN f.documents d " +
            "WHERE f.createdBy = :user " +
            "GROUP BY f.id, f.name")
    List<Object[]> findFoldersWithDocumentCount(@Param("user") User user);
}