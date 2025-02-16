package com.td.dms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.td.dms.entity.Comment;
import com.td.dms.entity.Post;
import com.td.dms.entity.User;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 게시글별 댓글 조회
    List<Comment> findByPost(Post post);

    // 특정 사용자의 댓글 조회
    List<Comment> findByAuthor(User author);

    // 게시글별 댓글 수 조회
    long countByPost(Post post);

    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}