import { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DocumentList from "../components/DocumentList";
import DocumentForm from "../components/DocumentForm";
import { Document } from "../types";
import { documentApi } from "../api/api";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

const RecentDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getRecentDocuments();
      setDocuments(response.data as Document[]);
    } catch (error) {
      console.error("최근 문서 목록 조회 실패:", error);
    }
  };

  return (
    <PageContainer>
      <PageTitle
        title="최근 문서"
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedDocument(null);
              setIsFormOpen(true);
            }}
          >
            새 문서 작성
          </Button>
        }
      />

      <DocumentList
        documents={documents}
        onDocumentClick={(doc) => {
          setSelectedDocument(doc);
          setIsFormOpen(true);
        }}
      />

      <DocumentForm
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
        initialTitle={selectedDocument?.title}
        initialContent={selectedDocument?.content}
        initialFiles={selectedDocument?.files}
        initialStarred={selectedDocument?.isStarred}
        onSubmit={async (formData) => {
          if (selectedDocument) {
            await documentApi.updateDocument(selectedDocument.id, formData);
          } else {
            await documentApi.createDocument(formData);
          }
          fetchDocuments();
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
      />
    </PageContainer>
  );
};

export default RecentDocuments;
