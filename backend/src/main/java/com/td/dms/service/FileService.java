package com.td.dms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.MultipartConfigElement;

import com.td.dms.entity.FileEntity;
import com.td.dms.repository.FileRepository;
import com.td.dms.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.net.MalformedURLException;
import com.td.dms.dto.FileDownloadResponse;
import lombok.extern.slf4j.Slf4j;
import com.td.dms.entity.Document;
import com.td.dms.entity.Post;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    private final String uploadDir = "uploads";
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final MultipartConfigElement multipartConfigElement;

    public FileEntity uploadFile(MultipartFile file, String username, Post post) throws IOException {
        FileEntity fileEntity = uploadFileCommon(file, username);
        fileEntity.setPost(post);
        return fileRepository.save(fileEntity);
    }

    public FileEntity uploadFile(MultipartFile file, String username, Document document) throws IOException {
        FileEntity fileEntity = uploadFileCommon(file, username);
        fileEntity.setDocument(document);
        return fileRepository.save(fileEntity);
    }

    private FileEntity uploadFileCommon(MultipartFile file, String username) throws IOException {
        validateFile(file);
        createUploadDirectoryIfNotExists();

        String originalFileName = Optional.ofNullable(file.getOriginalFilename())
                .orElseThrow(() -> new RuntimeException("파일명이 없습니다."));
        String cleanFileName = StringUtils.cleanPath(originalFileName);
        String fileExtension = getFileExtension(cleanFileName);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        Path targetLocation = Paths.get(uploadDir).resolve(storedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setOriginalFileName(originalFileName);
        fileEntity.setStoredFileName(storedFileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setFilePath(targetLocation.toString());
        fileEntity.setUploadedBy(userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found")));

        return fileEntity;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename()).toLowerCase();
        if (!isAllowedExtension(fileExtension)) {
            throw new RuntimeException("허용되지 않는 파일 형식입니다.");
        }

        if (file.getSize() > multipartConfigElement.getMaxFileSize()) {
            throw new RuntimeException(
                    "파일 크기는 " + (multipartConfigElement.getMaxFileSize() / (1024 * 1024)) + "MB를 초과할 수 없습니다.");
        }
    }

    private Boolean isAllowedExtension(String extension) {
        return Arrays.asList(".pdf", ".doc", ".docx", ".xls", ".xlsx")
                .contains(extension.toLowerCase());
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private void createUploadDirectoryIfNotExists() throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    public void deleteFile(Long fileId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 실제 파일 삭제
        Path filePath = Paths.get(file.getFilePath());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("파일 삭제 중 오류 발생: {}", e.getMessage());
        }

        fileRepository.delete(file);
    }

    public FileDownloadResponse downloadFile(Long fileId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        Path filePath = Paths.get(file.getFilePath());
        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("파일을 찾을 수 없습니다.", e);
        }

        return new FileDownloadResponse(
                file.getOriginalFileName(),
                file.getFileType(),
                resource);
    }

    public FileEntity getFile(Long fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));
    }
}