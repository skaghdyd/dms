import { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileList from "./FileList";
import CloseIcon from "@mui/icons-material/Close";

interface DocumentFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialFiles?: Array<{
    id: number;
    originalFileName: string;
    fileSize: number;
  }>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  onFileDownload?: (fileId: number, fileName: string) => void;
  open?: boolean;
  readOnly?: boolean;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  onFileDelete?: (fileId: number) => Promise<void>;
  onDelete?: () => void;
  showDelete?: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];

const validateFile = (file: File): string | null => {
  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return `파일 크기는 100MB를 초과할 수 없습니다. (현재 크기: ${(
      file.size /
      (1024 * 1024)
    ).toFixed(2)}MB)`;
  }

  // 파일 타입 검증
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
    return `허용되지 않는 파일 형식입니다. (허용된 형식: ${ALLOWED_FILE_EXTENSIONS.join(
      ", "
    )})`;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `허용되지 않는 파일 타입입니다.`;
  }

  return null;
};

const DocumentForm = ({
  initialTitle = "",
  initialContent = "",
  initialFiles = [],
  onSubmit,
  onCancel,
  onFileDownload,
  open = false,
  readOnly = false,
  onEdit,
  onCancelEdit,
  onFileDelete,
  onDelete,
  showDelete = false,
}: DocumentFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState(initialFiles);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달이 열리고 닫힐 때, 그리고 initialTitle, initialContent, initialFiles가 변경될 때 초기화
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setContent(initialContent);
      setFiles(initialFiles);
      setNewFiles([]);
      setError(null);
    }
  }, [open]); // 의존성 배열에 초기값들 추가

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    // 파일 유효성 검사
    const invalidFiles = selectedFiles
      .map((file) => ({
        file,
        error: validateFile(file),
      }))
      .filter((result) => result.error !== null);

    if (invalidFiles.length > 0) {
      setError(
        invalidFiles
          .map((result) => `${result.file.name}: ${result.error}`)
          .join("\n")
      );
      return;
    }

    // 중복 파일 필터링 제거
    setNewFiles((prev) => [...prev, ...selectedFiles]);
    setError(null);

    // input 초기화
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = async (fileId: number) => {
    try {
      if (onFileDelete) {
        await onFileDelete(fileId);
      }
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (error) {
      setError("파일 삭제에 실패했습니다.");
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSaving || isSubmitted) return;

      try {
        setIsSaving(true);
        setIsSubmitted(true);

        // 제목 검증
        if (!title.trim()) {
          setError("제목을 입력해주세요.");
          return;
        }

        if (title.trim().length > 255) {
          setError("제목은 255자를 초과할 수 없습니다.");
          return;
        }

        // 내용 검증
        if (!content.trim()) {
          setError("내용을 입력해주세요.");
          return;
        }

        if (content.trim().length > 1000) {
          setError("내용은 1000자를 초과할 수 없습니다.");
          return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("content", content.trim());
        formData.append(
          "remainingFileIds",
          JSON.stringify(files.map((file) => file.id))
        );
        newFiles.forEach((file) => {
          formData.append("files", file);
        });

        await onSubmit(formData);
      } catch (error) {
        console.error("저장 실패:", error);
        setError("문서 저장에 실패했습니다.");
        setIsSubmitted(false);
      } finally {
        setIsSaving(false);
      }
    },
    [title, content, files, newFiles, isSaving, onSubmit, isSubmitted]
  );

  // Dialog가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsSubmitted(false);
      setIsSaving(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <Backdrop
        sx={{
          zIndex: 99998,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        open={open}
        onClick={onCancel}
      />
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: "fixed",
            top: "50%",
            left: { xs: "50%", md: "55%" },
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "85%", md: "65%" },
            maxWidth: "850px",
            height: "auto",
            maxHeight: { xs: "95vh", sm: "85vh" },
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            zIndex: 99999,
            overflow: "hidden",
            m: 2,
            borderRadius: "8px",
            bgcolor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "#f8f9fa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {readOnly
                  ? "문서 보기"
                  : initialTitle
                  ? "문서 수정"
                  : "새 문서 작성"}
              </Typography>
              <IconButton
                onClick={onCancel}
                size="small"
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              flex: 1,
              minHeight: 0,
              maxHeight: { xs: "calc(95vh - 150px)", sm: "calc(85vh - 150px)" },
              overflow: "auto",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2.5,
                flex: { xs: "1 1 auto", md: "1 1 60%" },
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={readOnly || isSaving}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                  },
                }}
              />
              <TextField
                fullWidth
                label="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={readOnly || isSaving}
                required
                multiline
                rows={10}
                variant="outlined"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                p: 2.5,
                flex: { xs: "1 1 auto", md: "1 1 40%" },
                display: "flex",
                flexDirection: "column",
                borderLeft: { xs: 0, md: 1 },
                borderTop: { xs: 1, md: 0 },
                borderColor: "divider",
                minHeight: 0,
                bgcolor: "#f8f9fa",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, flex: "0 0 auto" }}>
                첨부 파일
              </Typography>
              <Box sx={{ flex: 1, overflow: "auto" }}>
                {files.length > 0 && (
                  <FileList
                    files={files}
                    onDelete={!readOnly ? handleRemoveExistingFile : undefined}
                    onDownload={readOnly ? onFileDownload : undefined}
                  />
                )}

                {newFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      새로 추가된 파일:
                    </Typography>
                    <FileList
                      files={newFiles.map((file, index) => ({
                        id: index,
                        originalFileName: file.name,
                        fileSize: file.size,
                      }))}
                      onDelete={!readOnly ? handleRemoveNewFile : undefined}
                      onDownload={
                        readOnly
                          ? (fileId, fileName) =>
                              onFileDownload?.(fileId, fileName)
                          : undefined
                      }
                    />
                  </Box>
                )}
              </Box>
              {!readOnly && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  sx={{ mt: 2, flex: "0 0 auto" }}
                  disabled={isSaving}
                >
                  파일 첨부
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileSelect}
                  />
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              bgcolor: "#f8f9fa",
            }}
          >
            {readOnly ? (
              <>
                <Button onClick={onCancel}>닫기</Button>
                {onEdit && (
                  <Button onClick={onEdit} variant="contained" color="primary">
                    수정
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button onClick={onCancel} disabled={isSaving}>
                  닫기
                </Button>
                {initialTitle && (
                  <>
                    <Button onClick={onCancelEdit} disabled={isSaving}>
                      취소
                    </Button>
                    {showDelete && (
                      <Button
                        onClick={onDelete}
                        color="error"
                        disabled={isSaving}
                      >
                        삭제
                      </Button>
                    )}
                  </>
                )}
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={isSaving || isSubmitted}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
              </>
            )}
          </Box>

          {error && (
            <Typography
              color="error"
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "#fff3f3",
                borderTop: 1,
                borderColor: "#ffcdd2",
              }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Fade>
    </>
  );
};

export default DocumentForm;
