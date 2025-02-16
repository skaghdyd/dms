import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useSnackbar } from "notistack";
import api from "../api/api";

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

interface CommentsProps {
  postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data as Comment[]);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      enqueueSnackbar("댓글을 불러오는데 실패했습니다.", { variant: "error" });
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await api.post(`/comments`, { postId, content });
      await fetchComments();
      enqueueSnackbar("댓글이 등록되었습니다.", { variant: "success" });
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      enqueueSnackbar("댓글 등록에 실패했습니다.", { variant: "error" });
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await api.put(`/comments/${commentId}`, { postId, content });
      await fetchComments();
      enqueueSnackbar("댓글이 수정되었습니다.", { variant: "success" });
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      enqueueSnackbar("댓글 수정에 실패했습니다.", { variant: "error" });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeleteCommentId(commentId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCommentId) return;

    try {
      await api.delete(`/comments/${deleteCommentId}`);
      await fetchComments();
      enqueueSnackbar("댓글이 삭제되었습니다.", { variant: "success" });
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      enqueueSnackbar("댓글 삭제에 실패했습니다.", { variant: "error" });
    } finally {
      setDeleteCommentId(null);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        댓글
      </Typography>
      <CommentForm onSubmit={handleAddComment} />
      <List>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </List>
      <Dialog
        open={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
      >
        <DialogTitle>댓글 삭제</DialogTitle>
        <DialogContent>정말로 이 댓글을 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCommentId(null)}>취소</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Comments;
