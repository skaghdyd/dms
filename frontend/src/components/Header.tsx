import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  styled,
  Snackbar,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import PaletteIcon from "@mui/icons-material/Palette";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import ThemeSettingsDialog from "./ThemeSettingsDialog";
import ConfirmDialog from "./ConfirmDialog";

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

// 커스텀 스타일링된 Tabs 컴포넌트
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 4,
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.common.white
        : theme.palette.primary.light,
    borderRadius: "2px 2px 0 0",
  },
  "& .MuiTab-root": {
    color:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.7)"
        : "rgba(255, 255, 255, 0.7)",
    "&.Mui-selected": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.common.white
          : theme.palette.primary.light,
    },
    "&:hover": {
      color: theme.palette.common.white,
      opacity: 1,
    },
    transition: "color 0.2s",
  },
}));

// 커스텀 스타일링된 Tab 컴포넌트
const StyledTab = styled(Tab)({
  "&.Mui-focusVisible": {
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:focus": {
    outline: "none",
  },
});

// 커스텀 스타일링된 IconButton
const StyledIconButton = styled(IconButton)({
  "&:focus": {
    outline: "none",
  },
  "&.Mui-focusVisible": {
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const LogoText = styled(Typography)(({ theme }) => ({
  variant: "logo",
  color:
    theme.palette.mode === "light"
      ? theme.palette.common.white
      : theme.palette.primary.light,
  marginLeft: theme.spacing(1),
  fontWeight: 700,
}));

const Header = ({ currentTab, onTabChange, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const settingsMenuItems = [
    {
      label: "테마 설정",
      icon: <PaletteIcon fontSize="small" />,
      onClick: () => {
        handleSettingsClose();
        setThemeDialogOpen(true);
      },
    },
    {
      label: "프로필 설정",
      icon: <PersonIcon fontSize="small" />,
      path: "/settings/profile",
    },
    {
      label: "비밀번호 변경",
      icon: <LockIcon fontSize="small" />,
      path: "/settings/password",
    },
    {
      label: "알림 설정",
      icon: <NotificationsIcon fontSize="small" />,
      path: "/settings/notifications",
    },
  ];

  const handleLogout = () => {
    onLogout();
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleSettingsItemClick = (item: (typeof settingsMenuItems)[0]) => {
    if (item.label === "테마 설정") {
      if (item.onClick) {
        item.onClick();
      }
    } else {
      setSnackbarOpen(true);
    }
    handleSettingsClose();
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.primary.main,
        }}
      >
        <Toolbar sx={{ height: 64, minHeight: 64 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: 4,
              height: "100%",
              "&:hover": {
                "& .logo": {
                  transform: "scale(1.1)",
                },
              },
            }}
            onClick={() => navigate("/documents")}
          >
            <Logo
              sx={{
                fontSize: 32,
                transition: "transform 0.2s ease",
              }}
              className="logo"
            />
            <LogoText>DMS</LogoText>
          </Box>

          <StyledTabs
            value={currentTab}
            onChange={(_, value) => onTabChange(value)}
            textColor="inherit"
            sx={{
              flexGrow: 1,
              "& .MuiTab-root": {
                fontSize: "0.95rem",
                fontWeight: 500,
                minHeight: 64,
                py: 0,
              },
            }}
          >
            <StyledTab label="문서" value="documents" />
            <StyledTab label="게시판" value="boards" />
            <StyledTab label="일정" value="calendar" />
          </StyledTabs>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username}님 환영합니다.
          </Typography>

          <StyledIconButton
            color="inherit"
            onClick={handleSettingsClick}
            sx={{
              backgroundColor: settingsAnchorEl
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
            }}
          >
            <SettingsIcon />
          </StyledIconButton>
          <Menu
            anchorEl={settingsAnchorEl}
            open={Boolean(settingsAnchorEl)}
            onClose={handleSettingsClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                  "& .MuiMenuItem-root": {
                    "&:focus": {
                      outline: "none",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0, 0, 0, 0.04)"
                          : "rgba(255, 255, 255, 0.08)",
                    },
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {settingsMenuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => handleSettingsItemClick(item)}
                sx={{
                  py: 1,
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Menu>
          <StyledIconButton
            color="inherit"
            onClick={handleLogoutClick}
            sx={{ ml: 2 }}
          >
            <LogoutIcon />
          </StyledIconButton>
        </Toolbar>
      </AppBar>

      <ThemeSettingsDialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />

      <ConfirmDialog
        open={logoutDialogOpen}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          mt: 8, // AppBar 아래에 표시되도록 상단 여백 추가
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={(theme) => ({
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
            "& .MuiAlert-icon": {
              color: theme.palette.common.white,
            },
            color: theme.palette.common.white,
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
          })}
        >
          해당 기능은 현재 개발 중입니다.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
