package com.td.dms.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import com.td.dms.service.DocumentService;

import com.td.dms.entity.Document;
import com.td.dms.dto.DocumentRequest;
import lombok.RequiredArgsConstructor;
import com.td.dms.util.JwtUtil;
import org.springframework.web.multipart.MultipartFile;
import com.td.dms.dto.DocumentResponse;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(
            @RequestPart(value = "request") DocumentRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        Document document = documentService.createDocument(request, files, username);
        DocumentResponse response = new DocumentResponse(document);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updateDocument(
            @PathVariable Long id,
            @RequestPart(value = "request") DocumentRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        Document document = documentService.updateDocument(id, request, files, username);
        DocumentResponse response = new DocumentResponse(document);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByFolder(
            @PathVariable Long folderId,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        List<Document> documents = documentService.getDocumentsByFolder(folderId, username);
        List<DocumentResponse> response = documents.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/starred")
    public ResponseEntity<List<DocumentResponse>> getStarredDocuments(
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        List<Document> documents = documentService.getStarredDocuments(username);
        List<DocumentResponse> response = documents.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<DocumentResponse>> getRecentDocuments(
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        List<Document> documents = documentService.getRecentDocuments(username);
        List<DocumentResponse> response = documents.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        DocumentResponse response = new DocumentResponse(document);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        List<DocumentResponse> response = documents.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
