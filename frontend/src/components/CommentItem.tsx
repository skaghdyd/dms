import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../contexts/AuthContext";

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
  };
  onEdit?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { user } = useAuth();

  useEffect(() => {
    setEditContent(comment.content);
  }, [comment.content]);

  const handleEditSubmit = () => {
    if (onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <ListItem divider>
      {isEditing ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            multiline
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            size="small"
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={handleCancel}>
              취소
            </Button>
            <Button size="small" variant="contained" onClick={handleEditSubmit}>
              수정
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <ListItemText
            primary={comment.content}
            secondary={`${comment.authorName} | ${new Date(
              comment.createdAt
            ).toLocaleString()}`}
            sx={{ pr: 2 }}
          />
          {comment.authorName === user?.username && (
            <Box>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete && onDelete(comment.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </>
      )}
    </ListItem>
  );
};

export default CommentItem;
