import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { username, password });
      alert("로그인 성공!");
      console.log(res.data);
    } catch (error) {
      alert("로그인 실패!");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <button onClick={() => navigate("/signup")}>회원가입</button>
    </div>
  );
};

export default Login;
