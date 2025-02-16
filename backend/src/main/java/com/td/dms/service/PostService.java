package com.td.dms.service;

import com.td.dms.dto.PostRequest;
import com.td.dms.dto.PostResponse;
import com.td.dms.dto.FileResponse;
import com.td.dms.dto.CommentResponse;
import com.td.dms.entity.Post;
import com.td.dms.entity.User;
import com.td.dms.entity.FileEntity;
import com.td.dms.repository.PostRepository;
import com.td.dms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final CommentService commentService;

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        postRepository.incrementViewCount(id);
        return convertToResponse(post);
    }

    @Transactional
    public PostResponse createPost(PostRequest request, List<MultipartFile> files, String username) {
        try {
            User author = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Post post = new Post();
            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setAuthor(author);

            // 먼저 post 저장
            post = postRepository.save(post);

            // 그 다음 파일 처리
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    FileEntity fileEntity = fileService.uploadFile(file, username, post);
                    post.addFile(fileEntity);
                }
            }

            return convertToResponse(postRepository.save(post));
        } catch (Exception e) {
            log.error("게시글 생성 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("게시글 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request, List<MultipartFile> files, String username) {
        try {
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

            if (!post.getAuthor().getUsername().equals(username)) {
                throw new RuntimeException("게시글 수정 권한이 없습니다.");
            }

            post.setTitle(request.getTitle());
            post.setContent(request.getContent());

            // 기존 파일 중 유지할 파일만 남기고 나머지 삭제
            post.getFiles().removeIf(file -> {
                if (!request.getFileIds().contains(file.getId())) {
                    fileService.deleteFile(file.getId());
                    return true;
                }
                return false;
            });

            // 새로운 파일 추가
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    FileEntity fileEntity = fileService.uploadFile(file, username, post);
                    post.addFile(fileEntity);
                }
            }

            return convertToResponse(postRepository.save(post));
        } catch (Exception e) {
            log.error("게시글 수정 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("게시글 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }

        // 파일 삭제
        post.getFiles().forEach(file -> fileService.deleteFile(file.getId()));

        postRepository.delete(post);
    }

    private PostResponse convertToResponse(Post post) {
        List<FileResponse> fileResponses = post.getFiles().stream()
                .map(file -> FileResponse.builder()
                        .id(file.getId())
                        .originalFileName(file.getOriginalFileName())
                        .fileSize(file.getFileSize())
                        .build())
                .collect(Collectors.toList());

        List<CommentResponse> recentComments = commentService.getRecentComments(post.getId(), 5);

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getAuthor().getUsername())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .commentCount((int) commentService.getCommentCount(post.getId()))
                .files(fileResponses)
                .recentComments(recentComments)
                .build();
    }

    public Page<PostResponse> searchByTitle(String keyword, Pageable pageable) {
        return postRepository.findByTitleContaining(keyword, pageable)
                .map(this::convertToResponse);
    }

    public Page<PostResponse> searchByContent(String keyword, Pageable pageable) {
        return postRepository.findByContentContaining(keyword, pageable)
                .map(this::convertToResponse);
    }

    public Page<PostResponse> searchByTitleOrContent(String keyword, Pageable pageable) {
        return postRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable)
                .map(this::convertToResponse);
    }
}