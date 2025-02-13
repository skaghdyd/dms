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
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomScrollbar from "./CustomScrollbar";
import Documents from "../pages/Documents";
import Boards from "../pages/Boards";
import Calendar from "../pages/Calendar";
import "./Layout.css";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로에서 현재 탭 결정
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
    localStorage.removeItem("token");
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#f5f5f5",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden", // 전체 레이아웃 스크롤 방지
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
        sx={{
          flexGrow: 1,
          marginTop: "64px",
          marginLeft: `${sidebarOpen ? 20 : -220}px`,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          height: "calc(100vh - 64px)",
          position: "relative",
          overflowX: "hidden",
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
          <Routes>
            <Route path="/documents/*" element={<Documents />} />
            <Route path="/boards/*" element={<Boards />} />
            <Route path="/calendar/*" element={<Calendar />} />
            <Route path="/" element={<Navigate to="/documents" replace />} />
          </Routes>
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
