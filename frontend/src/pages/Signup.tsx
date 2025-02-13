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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 입력값 검증
    if (!username.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (username.trim().length < 4) {
      alert("아이디는 4자 이상이어야 합니다.");
      return;
    }

    if (password.trim().length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    try {
      await api.post("/api/auth/signup", {
        username: username.trim(),
        password: password.trim(),
      });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 실패!");
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
            회원가입
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
            onClick={handleSignup}
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
  );
};

export default Signup;
