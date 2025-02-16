package com.td.dms.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import com.td.dms.service.DocumentService;

import com.td.dms.entity.Document;
import com.td.dms.dto.DocumentRequest;
import lombok.RequiredArgsConstructor;
import com.td.dms.util.JwtUtil;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;
    private final JwtUtil jwtUtil;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Document> createDocument(
            @RequestHeader("Authorization") String token,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {

        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        DocumentRequest request = new DocumentRequest();
        request.setTitle(title);
        request.setContent(content);

        Document document = documentService.createDocument(username, request, files);
        return ResponseEntity.ok(document);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Document> createDocumentJson(
            @RequestHeader("Authorization") String token,
            @RequestBody DocumentRequest request) {

        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        Document document = documentService.createDocument(username, request, null);
        return ResponseEntity.ok(document);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart("remainingFileIds") String remainingFileIdsJson) {

        DocumentRequest request = new DocumentRequest();
        request.setTitle(title);
        request.setContent(content);

        // JSON 문자열을 List<Long>으로 변환
        List<Long> remainingFileIds;
        try {
            ObjectMapper mapper = new ObjectMapper();
            remainingFileIds = mapper.readValue(remainingFileIdsJson,
                    new TypeReference<List<Long>>() {
                    });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("파일 ID 목록 처리 중 오류가 발생했습니다.");
        }

        Document document = documentService.updateDocument(id, request, files, remainingFileIds);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }
}
