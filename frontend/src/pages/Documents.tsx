import { useState, useEffect } from "react";
import api from "../api/api";
import {
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DocumentForm from "../components/DocumentForm";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import DescriptionIcon from "@mui/icons-material/Description";
import AlertSnackbar from "../components/AlertSnackbar";

interface Document {
  id: number;
  title: string;
  content: string;
  createdBy:
    | {
        id: number;
        username: string;
        role: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
  files: Array<{
    id: number;
    originalFileName: string;
    fileSize: number;
  }>;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReadMode, setIsReadMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const showAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      const documentsData = Array.isArray(response.data) ? response.data : [];
      setDocuments(documentsData);
    } catch (error) {
      console.error("문서 목록을 불러오는데 실패했습니다:", error);
      setDocuments([]);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (formData: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await api.createDocument(formData);
      if (response) {
        await fetchDocuments();
        setIsFormOpen(false);
        setSelectedDocument(null);
        setIsEditing(false);
        setIsReadMode(false);
        showAlert("문서가 성공적으로 저장되었습니다.");
      }
    } catch (error) {
      console.error("문서 생성 실패:", error);
      showAlert("문서 생성에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDocument = async (formData: FormData) => {
    if (!selectedDocument || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await api.updateDocument(selectedDocument.id, formData);
      if (response) {
        await fetchDocuments();
        setIsFormOpen(false);
        setSelectedDocument(null);
        setIsEditing(false);
        setIsReadMode(false);
        showAlert("문서가 성공적으로 수정되었습니다.");
      }
    } catch (error) {
      console.error("문서 수정 실패:", error);
      showAlert("문서 수정에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      await api.delete(`/documents/${selectedDocument.id}`);
      setIsDeleteDialogOpen(false);
      setIsFormOpen(false);
      setSelectedDocument(null);
      setIsEditing(false);
      setIsReadMode(false);
      await fetchDocuments();
      showAlert("문서가 성공적으로 삭제되었습니다.");
    } catch (error) {
      showAlert("문서 삭제에 실패했습니다.", "error");
    }
  };

  const handleDownloadFile = async (fileId: number, fileName: string) => {
    try {
      await api.downloadFile(fileId, fileName);
    } catch (error) {
      showAlert("파일 다운로드에 실패했습니다.", "error");
    }
  };

  const handleRowClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsReadMode(true);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsReadMode(true);
  };

  return (
    <PageContainer>
      <Box sx={{ width: "100%" }}>
        <PageTitle
          title="전체 문서"
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setIsEditing(false);
                setSelectedDocument(null);
                setIsFormOpen(true);
              }}
            >
              새 문서 작성
            </Button>
          }
        />

        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={doc.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleRowClick(doc)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="div">
                      {doc.title}
                    </Typography>
                  </Box>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doc.content}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={
                        typeof doc.createdBy === "object" &&
                        doc.createdBy !== null
                          ? doc.createdBy.role
                          : doc.createdBy
                      }
                      size="small"
                      color="primary"
                    />

                    {doc.files && doc.files.length > 0 && (
                      <Chip
                        label={`첨부파일 ${doc.files.length}개`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    )}

                    {/* <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      작성일: {new Date(doc.createdAt).toLocaleDateString()}
                    </Typography> */}
                    {/* 작성일/수정일 정보를 담는 Box */}
                    <Box sx={{ ml: "auto", textAlign: "right" }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        작성일: {new Date(doc.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        수정일: {new Date(doc.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <DocumentForm
        initialTitle={selectedDocument?.title}
        initialContent={selectedDocument?.content}
        initialFiles={selectedDocument?.files}
        onSubmit={isEditing ? handleUpdateDocument : handleCreateDocument}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
          setIsReadMode(false);
          setIsEditing(false);
        }}
        onEdit={() => {
          setIsReadMode(false);
          setIsEditing(true);
        }}
        onCancelEdit={handleCancelEdit}
        onDelete={() => {
          setIsDeleteDialogOpen(true);
        }}
        onFileDownload={handleDownloadFile}
        open={isFormOpen}
        readOnly={isReadMode}
        showDelete={!isReadMode && !!selectedDocument?.title}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDocument}
        title="문서 삭제"
        content="정말 이 문서를 삭제하시겠습니까?"
      />

      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={handleCloseAlert}
      />
    </PageContainer>
  );
};

export default Documents;
