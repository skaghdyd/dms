import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface Document {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  filesCount: number; // 추가된 필드
}

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  onDeleteClick: (document: Document) => void;
}

const DocumentList = ({
  documents,
  onDocumentClick,
  onDeleteClick,
}: DocumentListProps) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>작성일</TableCell>
            <TableCell>첨부</TableCell>
            <TableCell>작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc: Document) => (
            <TableRow key={doc.id} hover onClick={() => onDocumentClick(doc)}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.createdBy}</TableCell>
              <TableCell>
                {new Date(doc.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {doc.filesCount > 0 && (
                  <Tooltip title={`첨부파일 ${doc.filesCount}개`}>
                    <AttachFileIcon color="action" fontSize="small" />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(doc);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentList;
