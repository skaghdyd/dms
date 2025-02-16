package com.td.dms.controller;

import com.td.dms.dto.PostRequest;
import com.td.dms.dto.PostResponse;
import com.td.dms.service.PostService;
import com.td.dms.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestPart("request") @Valid PostRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(postService.createPost(request, files, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestPart("request") @Valid PostRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(postService.updatePost(id, request, files, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        postService.deletePost(id, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "title") String searchType,
            Pageable pageable) {
        Page<PostResponse> posts;
        switch (searchType) {
            case "title":
                posts = postService.searchByTitle(keyword, pageable);
                break;
            case "content":
                posts = postService.searchByContent(keyword, pageable);
                break;
            case "all":
                posts = postService.searchByTitleOrContent(keyword, pageable);
                break;
            default:
                throw new IllegalArgumentException("Invalid search type");
        }
        return ResponseEntity.ok(posts);
    }
}