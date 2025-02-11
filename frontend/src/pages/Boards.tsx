import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const Boards = () => {
  return (
    <PageContainer>
      <Box>
        <PageTitle title="게시판" />
        <Typography color="text.secondary">
          게시판 기능은 현재 개발 중입니다.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Boards;
