import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  useTheme,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CircleIcon from "@mui/icons-material/Circle";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../contexts/AuthContext";
import {
  ThemeColor,
  useTheme as useCustomTheme,
} from "../contexts/ThemeContext";
import api from "../api/api";

const themeColors = [
  { name: "blue", color: "#1976d2" },
  { name: "purple", color: "#9c27b0" },
  { name: "green", color: "#2e7d32" },
  { name: "orange", color: "#ed6c02" },
  { name: "red", color: "#d32f2f" },
  { name: "cyan", color: "#0288d1" },
];

interface LoginResponse {
  token: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const { login } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const { color, setMode, setColor } = useCustomTheme();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      setOpenSnackbar(true);
    }
  }, [location]);

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newMode: "light" | "dark" | "system") => {
    setMode(newMode);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor as ThemeColor);
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      general: "",
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "아이디를 입력해주세요";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });
      const token = (response.data as LoginResponse).token;
      sessionStorage.setItem("token", token);

      // 로그인 성공 후 AuthContext의 user 상태 업데이트
      await login(token);

      navigate("/documents");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          general: "아이디 또는 비밀번호가 올바르지 않습니다",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "로그인에 실패했습니다. 다시 시도해주세요.",
        }));
      }
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <IconButton
            onClick={handleThemeClick}
            sx={{
              color:
                theme.palette.mode === "dark" ? "white" : "rgba(0, 0, 0, 0.7)",
            }}
          >
            <PaletteIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleThemeClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 220,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleThemeChange("light")}>
              <ListItemIcon>
                <LightModeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>라이트 모드</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange("dark")}>
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>다크 모드</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange("system")}>
              <ListItemIcon>
                <SettingsBrightnessIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>시스템 설정</ListItemText>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                테마 색상
              </Typography>
              <Grid container spacing={1}>
                {themeColors.map((themeColor) => (
                  <Grid item key={themeColor.name}>
                    <IconButton
                      size="small"
                      onClick={() => handleColorChange(themeColor.name)}
                      sx={{
                        width: 40,
                        height: 40,
                        color: themeColor.color,
                        border: color === themeColor.name ? 2 : 0,
                        borderColor: themeColor.color,
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 24,
                        },
                      }}
                    >
                      <CircleIcon />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Menu>
        </Box>

        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "100%",
                maxWidth: "400px", // 최대 너비 지정
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <LoginIcon
                  sx={{ fontSize: 40, mb: 1, color: "primary.main" }}
                />
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                  gutterBottom
                >
                  로그인
                </Typography>
              </Box>
              <TextField
                margin="none"
                required
                fullWidth
                label="아이디"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "", general: "" }));
                }}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "", general: "" }));
                }}
                error={!!errors.password}
                autoComplete="new-password"
              />
              {errors.general && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {errors.general}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                로그인
              </Button>
              <Box textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/signup")}
                >
                  계정이 없으신가요? 회원가입
                </Link>
              </Box>
            </Paper>
          </Box>
        </Container>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: 3,
              "& .MuiAlert-icon": {
                fontSize: "24px",
              },
              bgcolor: "primary.main", // 테마의 primary 색상 사용
              "& .MuiAlert-message": {
                color: "primary.contrastText", // primary 색상에 맞는 텍스트 색상
              },
            }}
          >
            회원가입이 완료되었습니다.
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default Login;
