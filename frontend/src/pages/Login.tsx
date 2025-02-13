import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";
import api from "../api/api";

interface LoginResponse {
  token: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 입력값 검증
    if (!username.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await api.post<LoginResponse>("/api/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });
      localStorage.setItem("token", res.data.token);
      navigate("/documents");
    } catch (error) {
      alert("로그인 실패!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            로그인
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="아이디"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
  );
};

export default Login;
