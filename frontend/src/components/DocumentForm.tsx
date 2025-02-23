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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileList from "./FileList";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { folderApi } from "../api/api";

interface DocumentFormProps {
  open?: boolean;
  initialTitle?: string;
  initialContent?: string;
  initialFiles?: Array<{
    id: number;
    originalFileName: string;
    fileSize: number;
  }>;
  initialFolderId?: number;
  initialStarred?: boolean;
  readOnly?: boolean;
  isEditing?: boolean;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  onFileDownload?: (fileId: number, fileName: string) => void;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  onFileDelete?: (fileId: number) => Promise<void>;
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
  initialFolderId,
  initialStarred = false,
  onSubmit,
  onCancel,
  onFileDownload,
  open = false,
  readOnly = false,
  onEdit,
  onCancelEdit,
  onFileDelete,
  onDelete,
  isEditing = false,
}: DocumentFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState(initialFiles);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [folderId, setFolderId] = useState<number | undefined>(initialFolderId);
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [folders, setFolders] = useState<Array<{ id: number; name: string }>>(
    []
  );

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setContent(initialContent);
      setFiles(initialFiles);
      setNewFiles([]);
      setTitleError("");
      setContentError("");
      setError(null);
      setIsContentChanged(false);
      setIsStarred(initialStarred);
      setFolderId(initialFolderId);
    }
  }, [open]);

  const checkContentChanged = useCallback(() => {
    const isTitleChanged = title !== initialTitle;
    const isContentChanged = content !== initialContent;
    const isFilesChanged =
      newFiles.length > 0 || files.length !== initialFiles.length;
    const isStarredChanged = isStarred !== initialStarred;
    const isFolderIdChanged = folderId !== initialFolderId;
    return (
      isTitleChanged ||
      isContentChanged ||
      isFilesChanged ||
      isStarredChanged ||
      isFolderIdChanged
    );
  }, [
    title,
    content,
    files,
    newFiles,
    isStarred,
    folderId,
    initialTitle,
    initialContent,
    initialFiles,
    initialStarred,
    initialFolderId,
  ]);

  useEffect(() => {
    setIsContentChanged(checkContentChanged());
  }, [
    title,
    content,
    files,
    newFiles,
    isStarred,
    folderId,
    checkContentChanged,
  ]);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setTitleError("");
    setIsSubmitted(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentError("");
    setIsSubmitted(false);
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
          setTitleError("제목을 입력해주세요.");
          setIsSaving(false);
          return;
        }

        if (title.trim().length > 255) {
          setTitleError("제목은 255자를 초과할 수 없습니다.");
          setIsSaving(false);
          return;
        }

        // 내용 검증
        if (!content.trim()) {
          setContentError("내용을 입력해주세요.");
          setIsSaving(false);
          return;
        }

        if (content.trim().length > 1000) {
          setContentError("내용은 1000자를 초과할 수 없습니다.");
          setIsSaving(false);
          return;
        }

        const formData = new FormData();

        // DocumentRequest를 JSON으로 추가
        const documentRequest = {
          title: title.trim(),
          content: content.trim(),
          remainingFileIds: files.map((file) => file.id),
          isStarred: isStarred,
          folderId: folderId || null,
        };

        formData.append(
          "request",
          new Blob([JSON.stringify(documentRequest)], {
            type: "application/json",
          })
        );

        // 파일들 추가
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
    [
      title,
      content,
      files,
      newFiles,
      isSaving,
      onSubmit,
      isSubmitted,
      isStarred,
      folderId,
    ]
  );

  const handleCancelEdit = () => {
    // 상태를 초기값으로 되돌림
    setTitle(initialTitle);
    setContent(initialContent);
    setFiles(initialFiles); // 기존 파일 목록을 초기 상태로 복원
    setIsStarred(initialStarred);
    setFolderId(initialFolderId);
    setNewFiles([]); // 새로 추가된 파일 목록 초기화
    setTitleError("");
    setContentError("");
    setError(null);

    // 부모 컴포넌트의 취소 핸들러 호출
    onCancelEdit?.();
  };

  // Dialog가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsSubmitted(false);
      setIsSaving(false);
    }
  }, [open]);

  // 폴더 목록 가져오기
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await folderApi.getFolders();
        setFolders(response.data as Array<{ id: number; name: string }>);
      } catch (error) {
        console.error("폴더 목록을 불러오는데 실패했습니다:", error);
      }
    };
    fetchFolders();
  }, []);

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
                onChange={handleTitleChange}
                disabled={readOnly || isSaving}
                required
                error={!!titleError}
                helperText={titleError}
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
                onChange={handleContentChange}
                disabled={readOnly || isSaving}
                required
                error={!!contentError}
                helperText={contentError}
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
                height: "355px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  첨부 파일
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  총 {files.length + newFiles.length}개
                </Typography>
              </Box>

              {error && (
                <Typography
                  color="error"
                  sx={{ mb: 1, whiteSpace: "pre-line" }}
                >
                  {error}
                </Typography>
              )}

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
              display: "flex",
              justifyContent: "space-between",
              borderTop: 1,
              borderColor: "divider",
              p: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl disabled={readOnly} sx={{ minWidth: 200 }}>
                <InputLabel>폴더</InputLabel>
                <Select
                  value={folderId || ""}
                  onChange={(e) => setFolderId(e.target.value as number)}
                  label="폴더"
                >
                  <MenuItem value="">
                    <em>폴더 없음</em>
                  </MenuItem>
                  {folders.map((folder) => (
                    <MenuItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isStarred}
                    onChange={(e) => {
                      setIsStarred(e.target.checked);
                    }}
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon />}
                  />
                }
                label="중요 문서"
                disabled={readOnly}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                gap: 1.5,
                bgcolor: "#f8f9fa",
              }}
            >
              {readOnly ? (
                <>
                  <Button onClick={onCancel}>닫기</Button>
                  {onEdit && (
                    <Button
                      onClick={onEdit}
                      variant="contained"
                      color="primary"
                    >
                      수정
                    </Button>
                  )}
                </>
              ) : isEditing ? (
                <>
                  <Button onClick={handleCancelEdit}>취소</Button>
                  <Button onClick={onDelete} color="error">
                    삭제
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSaving || isSubmitted || !isContentChanged}
                  >
                    {isSaving ? "저장 중..." : "저장"}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={onCancel} disabled={isSaving}>
                    닫기
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSaving || isSubmitted || !isContentChanged}
                  >
                    {isSaving ? "저장 중..." : "저장"}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default DocumentForm;
