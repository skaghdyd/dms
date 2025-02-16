import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PageContainer from "../components/PageContainer";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import Comments from "../components/Comments";

interface File {
  id: number;
  originalFileName: string;
  fileSize: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
  files: File[];
}

const handleFileDownload = async (fileId: number, fileName: string) => {
  try {
    await api.downloadFile(fileId, fileName);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
  }
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchPost();
    }
  }, [id, authLoading]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data as Post);
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      setError("게시글을 불러오는데 실패했습니다.");
    }
  };

  const handlePostDelete = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/boards/${id}`);
      navigate("/boards/general");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      setError("게시글 삭제에 실패했습니다.");
    }
  };

  if (authLoading || !post) return <CircularProgress />;

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              p: 2,
              mb: 3,
              borderBottom: "2px solid #eee",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {post?.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  작성자: {post?.authorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  작성일: {new Date(post?.createdAt || "").toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Chip
                  label={`조회 ${post?.viewCount}`}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`댓글 ${post?.commentCount}`}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, minHeight: "200px", mb: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {post?.content}
            </Typography>
          </Box>

          {post?.files && post.files.length > 0 && (
            <Box
              sx={{ p: 2, mb: 3, backgroundColor: "#f8f9fa", borderRadius: 1 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                첨부파일
              </Typography>
              <List dense>
                {post.files.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemText
                      primary={file.originalFileName}
                      secondary={`${Math.round(file.fileSize / 1024)}KB`}
                    />
                    <IconButton
                      onClick={() =>
                        handleFileDownload(file.id, file.originalFileName)
                      }
                      size="small"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              mb: 3,
              borderTop: "1px solid #eee",
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/boards/general")}
            >
              목록으로
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              {user?.username === post?.authorName && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/boards/edit/${id}`)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handlePostDelete}
                  >
                    삭제
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mt: 4 }}>
            {/*댓글영역*/}
            <Comments postId={Number(id)} />
          </Box>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default PostDetail;
