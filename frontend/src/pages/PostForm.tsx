import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PageContainer from "../components/PageContainer";
import api from "../api/api";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

interface Post {
  id: number;
  title: string;
  content: string;
  files: { id: number; originalFileName: string; fileSize: number }[];
}

interface FileInfo {
  id?: number;
  originalFileName: string;
  fileSize: number;
  isNew?: boolean;
  file?: File;
}

const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `파일 크기는 100MB를 초과할 수 없습니다. (현재 크기: ${(
      file.size /
      (1024 * 1024)
    ).toFixed(2)}MB)`;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `허용되지 않는 파일 형식입니다. (허용된 형식: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)`;
  }

  return null;
};

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const post = response.data as Post;
      setTitle(post.title);
      setContent(post.content);
      setFiles(
        post.files.map((f) => ({
          ...f,
          isNew: false,
        }))
      );
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      setError("게시글을 불러오는데 실패했습니다.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles)
      .map((file) => {
        const error = validateFile(file);
        if (error) {
          setError(error);
          return null;
        }
        return {
          originalFileName: file.name,
          fileSize: file.size,
          isNew: true,
          file: file,
        };
      })
      .filter(Boolean) as FileInfo[];

    setFiles((prev) => [...prev, ...newFiles]);
    event.target.value = "";
  };

  const handleFileDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      const postRequest = {
        title,
        content,
        fileIds: files.filter((f) => !f.isNew).map((f) => f.id),
      };

      // JSON 문자열을 Blob으로 변환하여 request 파트에 추가
      const requestBlob = new Blob([JSON.stringify(postRequest)], {
        type: "application/json",
      });
      formData.append("request", requestBlob);

      // 새로 추가된 파일들을 files 파트에 추가
      files
        .filter((f) => f.isNew && f.file)
        .forEach((fileInfo) => {
          if (fileInfo.file) {
            formData.append("files", fileInfo.file);
          }
        });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        await api.put(`/posts/${id}`, formData, config);
      } else {
        await api.post("/posts", formData, config);
      }

      navigate(-1);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      setError("게시글 저장에 실패했습니다.");
    }
  };

  return (
    <PageContainer>
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {isEdit ? "게시글 수정" : "새 게시글 작성"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={10}
              margin="normal"
              required
            />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: 1,
                borderColor: "divider",
                pb: 2,
              }}
            >
              <Box>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="file-input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    파일 첨부
                  </Button>
                </label>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  취소
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {isEdit ? "수정" : "작성"}
                </Button>
              </Box>
            </Box>

            {files.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  첨부파일 ({files.length})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <List sx={{ p: 0 }}>
                    {files.map((file, index) => (
                      <ListItem
                        key={index}
                        disableGutters
                        sx={{
                          py: 1,
                          borderBottom:
                            index < files.length - 1
                              ? "1px solid #eee"
                              : "none",
                        }}
                      >
                        <InsertDriveFileIcon
                          sx={{ mr: 2, color: "action.active" }}
                        />
                        <ListItemText
                          primary={file.originalFileName}
                          secondary={formatFileSize(file.fileSize)}
                          primaryTypographyProps={{
                            variant: "body2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                        />
                        <IconButton
                          edge="end"
                          onClick={() => handleFileDelete(index)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
          </form>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default PostForm;
