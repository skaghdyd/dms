import { useState, useEffect } from "react";
import api from "../api/api";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentDetail from "../components/DocumentDetail";
import { useTheme } from "@mui/material/styles";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(response.data as Document[]);
    } catch (error) {
      alert("문서 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/documents",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpen(false);
      setTitle("");
      setContent("");
      fetchDocuments();
    } catch (error) {
      alert("문서 생성에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/documents/${selectedDocument.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      alert("문서 삭제에 실패했습니다.");
    }
  };

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setDetailOpen(true);
  };

  return (
    <PageContainer>
      <Box sx={{ width: "100%" }}>
        <PageTitle
          title="문서 목록"
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              새 문서
            </Button>
          }
        />

        <Stack spacing={1.5}>
          {documents.map((doc) => (
            <Card
              key={doc.id}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : "white",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.action.hover
                      : "#f5f5f5",
                },
                borderRadius: 1,
                border: 1,
                borderColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.divider
                    : "transparent",
                transition: theme.transitions.create(
                  ["background-color", "border-color"],
                  {
                    duration: theme.transitions.duration.shortest,
                  }
                ),
              }}
            >
              <CardContent
                sx={{
                  py: 1.5,
                  "&:last-child": { pb: 1.5 },
                }}
                onClick={() => handleDocumentClick(doc)}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box flex={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {doc.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {doc.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      마지막 수정:{" "}
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(doc);
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>새 문서 작성</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="제목"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="내용"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleCreate} variant="contained">
              작성
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>문서 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              "{selectedDocument?.title}" 문서를 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              삭제
            </Button>
          </DialogActions>
        </Dialog>

        <DocumentDetail
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          document={selectedDocument}
        />
      </Box>
    </PageContainer>
  );
};

export default Documents;
