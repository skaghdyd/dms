import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

interface FileListProps {
  files: Array<{
    id: number;
    originalFileName: string;
    fileSize: number;
  }>;
  onDelete?: (fileId: number) => void;
  onDownload?: (fileId: number, fileName: string) => void;
}

const FileList = ({ files, onDelete, onDownload }: FileListProps) => {
  return (
    <List>
      {files.map((file) => (
        <ListItem
          key={file.id}
          secondaryAction={
            <Box>
              {onDownload && (
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={() => onDownload(file.id, file.originalFileName)}
                >
                  <DownloadIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(file.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          }
        >
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText
            primary={file.originalFileName}
            secondary={`${(file.fileSize / 1024 / 1024).toFixed(2)} MB`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;
