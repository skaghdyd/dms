import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api/api";

interface DocumentDetailProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  onUpdate: () => void;
}

const DocumentDetail = ({
  open,
  onClose,
  document,
  onUpdate,
}: DocumentDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [localDocument, setLocalDocument] = useState(document);

  useEffect(() => {
    setLocalDocument(document);
  }, [document]);

  const handleEditClick = () => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setIsEditing(true);
    }
  };

  const handleUpdate = async () => {
    // 입력값 검증
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (title.trim().length > 255) {
      alert("제목은 255자를 초과할 수 없습니다.");
      return;
    }

    try {
      const response = await api.put<typeof document>(
        `/api/documents/${document?.id}`,
        {
          title: title.trim(),
          content: content.trim(),
        }
      );

      setLocalDocument(response.data);
      setIsEditing(false);
      alert("문서가 성공적으로 수정되었습니다.");
      onUpdate();
    } catch (error) {
      alert("문서 수정에 실패했습니다.");
    }
  };

  if (!localDocument) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mr: 2 }}
          />
        ) : (
          <>
            <Typography variant="h6">{localDocument.title}</Typography>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {localDocument.content}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            component="span"
            sx={{ mr: 2 }}
          >
            작성일: {new Date(localDocument.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="span">
            수정일: {new Date(localDocument.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
        {isEditing ? (
          <Box>
            <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
              취소
            </Button>
            <Button onClick={handleUpdate} variant="contained">
              저장
            </Button>
          </Box>
        ) : (
          <Button onClick={onClose}>닫기</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDetail;
