package com.td.dms.service;

import org.springframework.stereotype.Service;
import com.td.dms.repository.CommentRepository;
import com.td.dms.repository.PostRepository;
import com.td.dms.repository.UserRepository;
import com.td.dms.dto.CommentRequest;
import com.td.dms.dto.CommentResponse;
import com.td.dms.entity.Comment;
import com.td.dms.entity.Post;
import com.td.dms.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        List<Comment> comments = commentRepository.findByPost(post);
        return comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(user);

        return convertToResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse updateComment(Long id, CommentRequest request, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("댓글 수정 권한이 없습니다.");
        }

        comment.setContent(request.getContent());
        return convertToResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    public List<CommentResponse> getRecentComments(Long postId, int count) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        return commentRepository.findByPostOrderByCreatedAtDesc(post)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // public CommentResponse getCommentById(Long id) {
    // return commentRepository.findById(id)
    // .map(this::convertToResponse)
    // .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
    // }

    public long getCommentCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        return commentRepository.countByPost(post);
    }

    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getAuthor().getUsername())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
