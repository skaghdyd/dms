import { useState, useEffect } from "react";
import api from "../api/api";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
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
      const token = localStorage.getItem("token");
      await api.post(
        "/api/documents",
        { title: title.trim(), content: content.trim() },
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="25%">제목</TableCell>
                <TableCell width="45%">내용</TableCell>
                <TableCell align="right" width="10%">
                  작성일
                </TableCell>
                <TableCell align="right" width="10%">
                  수정일
                </TableCell>
                <TableCell align="right" width="10%">
                  작업
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow
                  key={document.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDocumentClick(document)}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {document.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {document.content}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(document);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
          onUpdate={fetchDocuments}
        />
      </Box>
    </PageContainer>
  );
};

export default Documents;
