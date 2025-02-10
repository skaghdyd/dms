package com.td.dms.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.td.dms.entity.Document;
import com.td.dms.entity.User;
import com.td.dms.repository.DocumentRepository;
import com.td.dms.repository.UserRepository;
import com.td.dms.dto.DocumentRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public Document createDocument(String username, DocumentRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없음"));

        Document document = new Document();
        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        document.setCreatedBy(user);
        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));
    }

    public Document updateDocument(Long id, DocumentRequest request) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));

        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없음"));

        documentRepository.delete(document);
    }
}
