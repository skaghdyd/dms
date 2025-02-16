import { Box, Typography } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const UnderDevelopment = ({ title }: { title: string }) => {
  return (
    <PageContainer>
      <Box>
        <PageTitle title={title} />
        <Typography color="text.secondary">
          해당 기능은 현재 개발 중입니다.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default UnderDevelopment;
