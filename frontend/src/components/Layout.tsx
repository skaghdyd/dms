import { useState } from "react";
import {
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomScrollbar from "./CustomScrollbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentTab = (path: string) => {
    if (path.startsWith("/documents")) return "documents";
    if (path.startsWith("/boards")) return "boards";
    if (path.startsWith("/calendar")) return "calendar";
    return "documents";
  };

  const currentTab = getCurrentTab(location.pathname);

  const handleTabChange = (newTab: string) => {
    navigate(`/${newTab}`);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("token");
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <Sidebar
        open={sidebarOpen}
        currentTab={currentTab}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          mt: "64px",
          ml: sidebarOpen ? "240px" : "72px",
          width: `calc(100% - ${sidebarOpen ? "240px" : "72px"})`,
          position: "fixed",
          right: 0,
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        <CustomScrollbar
          sx={{
            height: "100%",
            padding: 2,
            boxSizing: "border-box",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#f5f5f5",
          }}
        >
          <Outlet />
        </CustomScrollbar>
      </Box>
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>로그아웃</DialogTitle>
        <DialogContent>
          <DialogContentText>로그아웃 하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>취소</Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
