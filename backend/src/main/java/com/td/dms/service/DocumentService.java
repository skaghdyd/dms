package com.td.dms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.IOException;
import java.time.LocalDateTime;

import com.td.dms.entity.Document;
import com.td.dms.entity.User;
import com.td.dms.entity.FileEntity;
import com.td.dms.entity.Folder;
import com.td.dms.repository.DocumentRepository;
import com.td.dms.repository.UserRepository;
import com.td.dms.repository.FolderRepository;
import com.td.dms.dto.DocumentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;
    private final FileService fileService;

    @Transactional
    public Document createDocument(DocumentRequest request, List<MultipartFile> files, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Document document = new Document();
        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        document.setCreatedBy(user);
        document.setIsStarred(request.getIsStarred());

        // 폴더 설정
        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndCreatedBy(request.getFolderId(), user)
                    .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));
            document.setFolder(folder);
        }

        document = documentRepository.save(document);

        // 파일 처리
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    FileEntity fileEntity = fileService.uploadFile(file, username, document);
                    document.addFile(fileEntity);
                } catch (IOException e) {
                    log.error("파일 업로드 중 오류 발생: {}", e.getMessage());
                    throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
                }
            }
        }
        return documentRepository.save(document);
    }

    @Transactional
    public Document updateDocument(Long id, DocumentRequest request, List<MultipartFile> files, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다."));

        if (!document.getCreatedBy().equals(user)) {
            throw new RuntimeException("문서 수정 권한이 없습니다.");
        }

        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        document.setIsStarred(request.getIsStarred());
        List<Long> remainingFileIds = request.getRemainingFileIds();

        // 폴더 변경
        if (request.getFolderId() != null) {
            Folder newFolder = folderRepository.findByIdAndCreatedBy(request.getFolderId(), user)
                    .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));
            document.setFolder(newFolder);
        } else {
            document.setFolder(null);
        }
        // 파일 처리
        handleFileUpdates(document, files, remainingFileIds, username);
        return documentRepository.save(document);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByFolder(Long folderId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Folder folder = folderRepository.findByIdAndCreatedBy(folderId, user)
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        return documentRepository.findByFolderAndCreatedBy(folder, user);
    }

    @Transactional(readOnly = true)
    public List<Document> getStarredDocuments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return documentRepository.findByIsStarredTrueAndCreatedBy(user);
    }

    @Transactional(readOnly = true)
    public List<Document> getRecentDocuments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return documentRepository.findByCreatedByAndCreatedAtAfterOrderByCreatedAtDesc(user, thirtyDaysAgo);
    }

    private void handleFileUpdates(Document document, List<MultipartFile> newFiles, List<Long> remainingFileIds,
            String username) {
        // 삭제된 파일 처리
        document.getFiles().removeIf(file -> {
            if (remainingFileIds != null && remainingFileIds.contains(file.getId())) {
                return false;
            }
            fileService.deleteFile(file.getId());
            return true;
        });

        // 새 파일 추가
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                try {
                    FileEntity fileEntity = fileService.uploadFile(file, username, document);
                    document.addFile(fileEntity);
                } catch (IOException e) {
                    log.error("파일 업로드 중 오류 발생: {}", e.getMessage());
                    throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));
    }

    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));

        for (FileEntity file : document.getFiles()) {
            fileService.deleteFile(file.getId());
        }

        documentRepository.delete(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}
