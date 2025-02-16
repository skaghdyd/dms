package com.td.dms.controller;

import com.td.dms.dto.CommentRequest;
import com.td.dms.dto.CommentResponse;
import com.td.dms.service.CommentService;
import com.td.dms.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    // 특정 게시글의 댓글 목록 조회
    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @RequestBody @Valid CommentRequest request,
            @RequestHeader("Authorization") String token) {
        System.out.println("request: " + request.toString());
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(commentService.createComment(request, username));
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @RequestBody @Valid CommentRequest request,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(commentService.updateComment(id, request, username));
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        commentService.deleteComment(id, username);
        return ResponseEntity.noContent().build();
    }
}