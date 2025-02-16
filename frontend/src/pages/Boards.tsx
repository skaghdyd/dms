import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
} from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
  files: {
    id: number;
    originalFileName: string;
  }[];
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const Boards = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async () => {
    try {
      const response = await api.get<PageResponse<Post>>("/posts", {
        params: {
          page,
          size: 10,
          sort: "createdAt,desc",
        },
      });
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <PageContainer>
      <Box sx={{ width: "100%" }}>
        <PageTitle
          title="게시판"
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/boards/new")}
            >
              새 게시글
            </Button>
          }
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="8%" align="center">
                  번호
                </TableCell>
                <TableCell width="45%">제목</TableCell>
                <TableCell width="15%" align="center">
                  작성자
                </TableCell>
                <TableCell width="15%" align="center">
                  작성일
                </TableCell>
                <TableCell width="8%" align="center">
                  조회
                </TableCell>
                <TableCell width="9%" align="center">
                  댓글
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  onClick={() => navigate(`/boards/posts/${post.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="center">{post.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {post.title}
                      {post.files.length > 0 && (
                        <Chip
                          label={post.files.length}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{post.authorName}</TableCell>
                  <TableCell align="center">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{post.viewCount}</TableCell>
                  <TableCell align="center">{post.commentCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Boards;
