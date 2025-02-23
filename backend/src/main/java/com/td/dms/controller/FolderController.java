package com.td.dms.controller;

import com.td.dms.dto.FolderResponse;
import com.td.dms.service.FolderService;
import com.td.dms.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        FolderResponse folder = folderService.createFolder(request.get("name"), username);
        return ResponseEntity.ok(folder);
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> getFolders(
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        List<FolderResponse> folders = folderService.getFoldersByUser(username);
        return ResponseEntity.ok(folders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> updateFolder(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        FolderResponse folder = folderService.updateFolder(id, request.get("name"), username);
        return ResponseEntity.ok(folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        folderService.deleteFolder(id, username);
        return ResponseEntity.noContent().build();
    }
}