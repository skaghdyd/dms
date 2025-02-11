import { Box } from "@mui/material";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
