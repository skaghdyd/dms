import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CircleIcon from "@mui/icons-material/Circle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState<
    boolean | null
  >(null);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const { color, setMode, setColor } = useCustomTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const checkUsername = async () => {
    if (!username.trim() || username.trim().length < 4) {
      setErrors((prev) => ({
        ...prev,
        username: "아이디는 4자 이상이어야 합니다",
      }));
      return;
    }

    try {
      const response = await api.get(`/auth/check-username/${username.trim()}`);
      setIsUsernameDuplicate(!response.data);
      setIsUsernameChecked(true);
      setErrors((prev) => ({
        ...prev,
        username: !response.data
          ? "이미 사용 중인 아이디입니다"
          : "사용 가능한 아이디입니다",
        general: "",
      }));
    } catch (error: any) {
      setIsUsernameChecked(false);
      setErrors((prev) => ({
        ...prev,
        username: "중복 확인 중 오류가 발생했습니다",
      }));
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsUsernameDuplicate(null);
    setIsUsernameChecked(false);
    setErrors((prev) => ({
      ...prev,
      username: "아이디 중복확인이 필요합니다",
      general: "",
    }));
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
    } else if (username.trim().length < 4) {
      newErrors.username = "아이디는 4자 이상이어야 합니다";
      isValid = false;
    } else if (isUsernameDuplicate === null) {
      newErrors.username = "아이디 중복확인이 필요합니다";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    } else if (password.trim().length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await api.post("/auth/signup", {
        username: username.trim(),
        password: password.trim(),
      });
      navigate("/login", {
        state: { showSuccessMessage: true }, // 로그인 페이지로 상태 전달
      });
    } catch (error: any) {
      if (error.response?.data?.message?.includes("username")) {
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용 중인 아이디입니다",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "회원가입에 실패했습니다. 다시 시도해주세요.",
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
              <Stack direction="row" spacing={1}>
                {themeColors.map((themeColor) => (
                  <IconButton
                    key={themeColor.name}
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
                ))}
              </Stack>
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
                <PersonAddIcon
                  sx={{ fontSize: 40, mb: 1, color: "primary.main" }}
                />
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                  gutterBottom
                >
                  회원가입
                </Typography>
              </Box>
              <Box sx={{ position: "relative" }}>
                <TextField
                  margin="none"
                  required
                  fullWidth
                  label="아이디"
                  autoFocus
                  value={username}
                  onChange={handleUsernameChange}
                  error={
                    !!errors.username &&
                    isUsernameDuplicate !== null &&
                    isUsernameDuplicate
                  }
                  helperText={errors.username}
                  FormHelperTextProps={{
                    sx: {
                      color: isUsernameDuplicate ? undefined : "success.main",
                    },
                  }}
                  sx={{ mb: 0 }}
                />
                <Button
                  variant="outlined"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    height: 40,
                    minWidth: "80px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={checkUsername}
                  disabled={isUsernameChecked && !isUsernameDuplicate}
                >
                  중복확인
                </Button>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.trim().length < 6) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "비밀번호는 6자 이상이어야 합니다",
                      general: "",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                      general: "",
                    }));
                  }
                }}
                error={!!errors.password}
                helperText={errors.password}
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
                onClick={handleSignup}
                disabled={
                  !username.trim() ||
                  !password.trim() ||
                  password.trim().length < 6 ||
                  isUsernameDuplicate === null ||
                  isUsernameDuplicate === true
                }
              >
                가입하기
              </Button>
              <Box textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/login")}
                >
                  이미 계정이 있으신가요? 로그인
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
          <Alert severity="success" sx={{ width: "100%" }}>
            회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default Signup;
