import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DocumentList from "../components/DocumentList";
import DocumentForm from "../components/DocumentForm";
import { Document } from "../types";
import { documentApi } from "../api/api";
import AddIcon from "@mui/icons-material/Add";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

const AllDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await documentApi.createDocument(formData);
      fetchDocuments();
      setIsFormOpen(false);
    } catch (error) {
      console.error("문서 생성 실패:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getAllDocuments();
      setDocuments(response.data as Document[]);
    } catch (error) {
      console.error("문서 목록 조회 실패:", error);
    }
  };

  const handleRowClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleUpdateDocument = async (formData: FormData) => {
    try {
      if (!selectedDocument) return;
      await documentApi.updateDocument(selectedDocument.id, formData);
      fetchDocuments();
      setIsFormOpen(false);
      setSelectedDocument(null);
      setIsEditing(false);
    } catch (error) {
      console.error("문서 수정 실패:", error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      if (!selectedDocument) return;
      await documentApi.deleteDocument(selectedDocument.id);
      fetchDocuments();
      setIsFormOpen(false);
      setSelectedDocument(null);
      setIsEditing(false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("문서 삭제 실패:", error);
    }
  };

  return (
    <PageContainer>
      <PageTitle
        title="전체 문서"
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedDocument(null);
              setIsEditing(false);
              setIsFormOpen(true);
            }}
          >
            새 문서 작성
          </Button>
        }
      />

      <DocumentList documents={documents} onDocumentClick={handleRowClick} />

      <DocumentForm
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
          setIsEditing(false);
        }}
        initialTitle={selectedDocument?.title}
        initialContent={selectedDocument?.content}
        initialFiles={selectedDocument?.files}
        initialStarred={selectedDocument?.isStarred}
        initialFolderId={selectedDocument?.folder?.id}
        readOnly={!isEditing && !!selectedDocument}
        isEditing={isEditing}
        onSubmit={isEditing ? handleUpdateDocument : handleSubmit}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDocument}
        title="문서 삭제"
        content="정말 이 문서를 삭제하시겠습니까?"
      />
    </PageContainer>
  );
};

export default AllDocuments;
