import { Grid, Card, CardContent, Box, Typography, Chip } from "@mui/material";
import { Document } from "../types";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import FolderIcon from "@mui/icons-material/Folder";

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
}

const DocumentList = ({ documents, onDocumentClick }: DocumentListProps) => {
  return (
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
            onClick={() => onDocumentClick(doc)}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {doc.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <FolderIcon fontSize="small" />
                    {doc.folderId || "폴더 없음"}
                  </Typography>
                </Box>
                {doc.isStarred && (
                  <StarIcon color="warning" sx={{ ml: 1, flexShrink: 0 }} />
                )}
              </Box>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  Height: "1.5em",
                }}
              >
                {doc.content}
              </Typography>

              <Box
                sx={{
                  mt: "auto",
                  pt: 2,
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip label={doc.createdBy.role} size="small" color="primary" />
                {doc.files && doc.files.length > 0 && (
                  <Chip
                    label={`첨부파일 ${doc.files.length}개`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>

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
  );
};

export default DocumentList;
