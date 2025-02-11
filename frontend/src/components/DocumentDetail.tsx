import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

interface DocumentDetailProps {
  open: boolean;
  onClose: () => void;
  document: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

const DocumentDetail = ({ open, onClose, document }: DocumentDetailProps) => {
  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{document.title}</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            작성일: {new Date(document.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            수정일: {new Date(document.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {document.content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDetail;
