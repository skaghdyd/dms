package com.td.dms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.IOException;

import com.td.dms.entity.Document;
import com.td.dms.entity.User;
import com.td.dms.entity.FileEntity;
import com.td.dms.repository.DocumentRepository;
import com.td.dms.repository.UserRepository;
import com.td.dms.dto.DocumentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @Transactional
    public Document createDocument(String username, DocumentRequest request, List<MultipartFile> files) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없음"));

            Document document = new Document();
            document.setTitle(request.getTitle());
            document.setContent(request.getContent());
            document.setCreatedBy(user);

            // 먼저 document 저장
            document = documentRepository.save(document);

            // 그 다음 파일 처리
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    FileEntity fileEntity = fileService.uploadFile(file, username, document);
                    document.addFile(fileEntity);
                }
            }

            return documentRepository.save(document);
        } catch (Exception e) {
            log.error("문서 생성 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("문서 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Transactional
    public Document updateDocument(Long id, DocumentRequest request, List<MultipartFile> newFiles,
            List<Long> remainingFileIds) {
        try {
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));

            document.setTitle(request.getTitle());
            document.setContent(request.getContent());

            // 기존 파일 중 유지할 파일만 남기고 나머지 삭제
            document.getFiles().removeIf(file -> {
                if (!remainingFileIds.contains(file.getId())) {
                    fileService.deleteFile(file.getId());
                    return true;
                }
                return false;
            });

            // 새로운 파일 추가
            if (newFiles != null && !newFiles.isEmpty()) {
                for (MultipartFile file : newFiles) {
                    try {
                        FileEntity fileEntity = fileService.uploadFile(file, document.getCreatedBy().getUsername(),
                                document);
                        document.addFile(fileEntity);
                    } catch (IOException e) {
                        log.error("파일 업로드 중 오류 발생: {}", e.getMessage());
                        throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
                    }
                }
            }

            return documentRepository.save(document);
        } catch (Exception e) {
            log.error("문서 수정 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("문서 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));
    }

    @Transactional
    public void deleteDocument(Long id) {
        try {
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));

            // 연관된 파일들도 모두 삭제
            for (FileEntity file : document.getFiles()) {
                fileService.deleteFile(file.getId());
            }

            documentRepository.delete(document);
        } catch (Exception e) {
            log.error("문서 삭제 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("문서 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}
