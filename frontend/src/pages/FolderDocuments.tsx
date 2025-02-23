import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DocumentList from "../components/DocumentList";
import DocumentForm from "../components/DocumentForm";
import FolderFormDialog from "../components/FolderFormDialog";
import { Document, Folder } from "../types";
import { documentApi, folderApi } from "../api/api";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FolderDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [folderFormDialog, setFolderFormDialog] = useState({
    open: false,
    isEdit: false,
    folder: null as Folder | null,
  });

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchDocumentsByFolder(selectedFolder.id);
    } else {
      setDocuments([]);
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      const response = await folderApi.getFolders();
      setFolders(response.data as Folder[]);
    } catch (error) {
      console.error("폴더 목록 조회 실패:", error);
    }
  };

  const fetchDocumentsByFolder = async (folderId: number) => {
    try {
      const response = await documentApi.getDocumentsByFolder(folderId);
      setDocuments(response.data as Document[]);
    } catch (error) {
      console.error("문서 목록 조회 실패:", error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await folderApi.createFolder(name);
      fetchFolders();
    } catch (error) {
      console.error("폴더 생성 실패:", error);
    }
  };

  const handleUpdateFolder = async (id: number, name: string) => {
    try {
      await folderApi.updateFolder(id, name);
      fetchFolders();
    } catch (error) {
      console.error("폴더 수정 실패:", error);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await folderApi.deleteFolder(id);
      fetchFolders();
      if (selectedFolder?.id === id) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("폴더 삭제 실패:", error);
    }
  };

  return (
    <PageContainer>
      <PageTitle
        title="폴더별 문서"
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            새 문서 작성
          </Button>
        }
      />

      <Box sx={{ mb: 4 }}>
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
                    top: 39,
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
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
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

      {selectedFolder && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {selectedFolder.name} 폴더의 문서
          </Typography>
          <DocumentList
            documents={documents}
            onDocumentClick={(doc) => {
              setSelectedDocument(doc);
              setIsFormOpen(true);
            }}
          />
        </Box>
      )}

      <DocumentForm
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
        initialTitle={selectedDocument?.title}
        initialContent={selectedDocument?.content}
        initialFiles={selectedDocument?.files}
        initialFolderId={selectedFolder?.id}
        initialStarred={selectedDocument?.isStarred}
        onSubmit={async (formData) => {
          if (selectedDocument) {
            await documentApi.updateDocument(selectedDocument.id, formData);
          } else {
            await documentApi.createDocument(formData);
          }
          if (selectedFolder) {
            fetchDocumentsByFolder(selectedFolder.id);
          }
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
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
    </PageContainer>
  );
};

export default FolderDocuments;
