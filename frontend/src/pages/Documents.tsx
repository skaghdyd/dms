import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DocumentForm from "../components/DocumentForm";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import DescriptionIcon from "@mui/icons-material/Description";
import AlertSnackbar from "../components/AlertSnackbar";
import api, { documentApi, folderApi } from "../api/api";
import { Document, FileInfo, Folder } from "../types";
import FolderFormDialog from "../components/FolderFormDialog";

const Documents = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
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
  const [deleteFolderDialog, setDeleteFolderDialog] = useState({
    open: false,
    folder: null as Folder | null,
  });
  const [folderFormDialog, setFolderFormDialog] = useState({
    open: false,
    isEdit: false,
    folder: null as Folder | null,
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

  const getDocumentType = () => {
    const path = location.pathname;
    if (path.includes("/starred")) return "starred";
    if (path.includes("/recent")) return "recent";
    if (path.includes("/folders")) return "folders";
    return "all";
  };

  const fetchDocuments = async () => {
    try {
      let response;
      const type = getDocumentType();

      switch (type) {
        case "starred":
          response = await documentApi.getStarredDocuments();
          break;
        case "recent":
          response = await documentApi.getRecentDocuments();
          break;
        case "folders":
          if (selectedFolder) {
            response = await documentApi.getDocumentsByFolder(
              selectedFolder.id
            );
          } else {
            return; // 폴더가 선택되지 않은 경우 문서 로드하지 않음
          }
          break;
        default:
          response = await documentApi.getAllDocuments();
      }

      setDocuments(response.data as Document[]);
    } catch (error) {
      console.error("문서 목록 조회 실패:", error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await folderApi.getFolders();
      setFolders(response.data as Folder[]);
    } catch (error) {
      console.error("폴더 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (getDocumentType() === "folders") {
      fetchFolders();
    }
  }, [location]);

  useEffect(() => {
    fetchDocuments();
  }, [location, selectedFolder]);

  const handleCreateDocument = async (formData: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await documentApi.createDocument(formData);
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
      const response = await documentApi.updateDocument(
        selectedDocument.id,
        formData
      );
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
      await documentApi.deleteDocument(selectedDocument.id);
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

  const handleCreateFolder = async (name: string) => {
    try {
      await folderApi.createFolder(name);
      fetchFolders();
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      showAlert("폴더 생성에 실패했습니다.", "error");
    }
  };

  const handleUpdateFolder = async (id: number, name: string) => {
    try {
      await folderApi.updateFolder(id, name);
      fetchFolders();
    } catch (error) {
      console.error("폴더 수정 실패:", error);
      showAlert("폴더 수정에 실패했습니다.", "error");
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await folderApi.deleteFolder(id);
      fetchFolders();
      if (selectedFolder?.id === id) {
        setSelectedFolder(null);
      }
      showAlert("폴더가 삭제되었습니다.");
    } catch (error) {
      console.error("폴더 삭제 실패:", error);
      showAlert("폴더 삭제에 실패했습니다.", "error");
    }
  };

  return (
    <PageContainer>
      <PageTitle
        title={
          getDocumentType() === "folders"
            ? "폴더별 문서"
            : getDocumentType() === "starred"
            ? "중요 문서"
            : getDocumentType() === "recent"
            ? "최근 문서"
            : "전체 문서"
        }
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

      {getDocumentType() === "folders" && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            폴더 목록
          </Typography>
          <Grid container spacing={2}>
            {folders.map((folder) => (
              <Grid item xs={12} sm={6} md={3} key={folder.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    bgcolor:
                      selectedFolder?.id === folder.id
                        ? "action.selected"
                        : "background.paper",
                    position: "relative",
                  }}
                >
                  <CardContent
                    onClick={() => setSelectedFolder(folder)}
                    sx={{ pr: 8 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FolderIcon sx={{ mr: 1 }} />
                      <Typography>{folder.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      문서 {folder.documentCount}개
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 36,
                      right: 8,
                      display: "flex",
                      gap: 0.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFolderFormDialog({
                          open: true,
                          isEdit: true,
                          folder: folder,
                        });
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDeleteFolderDialog({
                          open: true,
                          folder: folder,
                        });
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={12}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "action.hover",
                }}
                onClick={() => {
                  setFolderFormDialog({
                    open: true,
                    isEdit: false,
                    folder: null,
                  });
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AddIcon />
                    <Typography>새 폴더</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
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
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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

                  {/* 태그 영역 */}
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
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
                  </Box>

                  {/* 작성일/수정일 정보를 담는 Box - 항상 하단에 고정 */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <DocumentForm
        initialTitle={selectedDocument?.title}
        initialContent={selectedDocument?.content}
        initialFiles={selectedDocument?.files as FileInfo[]}
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
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDocument}
        title="문서 삭제"
        content="정말 이 문서를 삭제하시겠습니까?"
      />

      <DeleteConfirmDialog
        open={deleteFolderDialog.open}
        onClose={() => setDeleteFolderDialog({ open: false, folder: null })}
        onConfirm={() => {
          if (deleteFolderDialog.folder) {
            handleDeleteFolder(deleteFolderDialog.folder.id);
          }
          setDeleteFolderDialog({ open: false, folder: null });
        }}
        title="폴더 삭제"
        content="이 폴더를 삭제하시겠습니까? 폴더 내의 모든 문서도 함께 삭제됩니다."
      />

      <FolderFormDialog
        open={folderFormDialog.open}
        onClose={() =>
          setFolderFormDialog({ open: false, isEdit: false, folder: null })
        }
        onSubmit={(name) => {
          if (folderFormDialog.isEdit && folderFormDialog.folder) {
            handleUpdateFolder(folderFormDialog.folder.id, name);
          } else {
            handleCreateFolder(name);
          }
          setFolderFormDialog({ open: false, isEdit: false, folder: null });
        }}
        initialName={folderFormDialog.folder?.name}
        title={folderFormDialog.isEdit ? "폴더 수정" : "새 폴더"}
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
