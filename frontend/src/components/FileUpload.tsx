import { useState } from "react";
import { Button, Box, Typography, LinearProgress, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../api/api";

interface FileUploadProps {
  onUploadSuccess?: (fileData: any) => void;
}

const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 제한을 100MB로 수정
      if (file.size > 100 * 1024 * 1024) {
        setError("파일 크기는 100MB를 초과할 수 없습니다.");
        return;
      }

      // 파일 확장자 검사는 유지
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx"];

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setError("허용되지 않는 파일 형식입니다.");
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setProgress(0);

      const response = await api.uploadFile(selectedFile, setProgress);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      setSelectedFile(null);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data || "파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload-input"
      />

      <label htmlFor="file-upload-input">
        <Button
          component="span"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
          fullWidth
          sx={{ mb: 2 }}
        >
          파일 선택
        </Button>
      </label>

      {selectedFile && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          선택된 파일: {selectedFile.name} (
          {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center">
            {progress}%
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        fullWidth
      >
        업로드
      </Button>
    </Box>
  );
};

export default FileUpload;
