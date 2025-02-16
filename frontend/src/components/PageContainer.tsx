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
        flexGrow: 1,
        transition: "all 0.3s ease-in-out",
        opacity: 1,
        animation: "fadeIn 0.3s ease-in-out",
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
