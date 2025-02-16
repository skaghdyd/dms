import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  initialContent?: string;
  isEdit?: boolean;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  initialContent = "",
  isEdit = false,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      if (!isEdit) {
        setContent(""); // 새 댓글 작성시에만 초기화
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isEdit ? "댓글을 수정하세요" : "댓글을 입력하세요"}
        size="small"
      />
      <Box sx={{ mt: 1, textAlign: "right" }}>
        {isEdit && (
          <Button
            onClick={onCancel}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          >
            취소
          </Button>
        )}
        <Button type="submit" variant="contained" size="small">
          {isEdit ? "수정" : "등록"}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;
