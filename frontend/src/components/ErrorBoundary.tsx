import { useRouteError } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function ErrorBoundary() {
  const error = useRouteError() as any;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.statusText ||
          error.message ||
          "요청하신 페이지를 찾을 수 없습니다."}
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          sessionStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        로그인 페이지로 이동
      </Button>
    </Box>
  );
}
