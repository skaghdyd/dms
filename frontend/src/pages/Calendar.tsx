import { Box, Typography } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const Calendar = () => {
  return (
    <PageContainer>
      <Box>
        <PageTitle title="일정" />
        <Typography color="text.secondary">
          일정 관리 기능은 현재 개발 중입니다.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Calendar;
