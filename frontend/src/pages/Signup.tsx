import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await api.post("/api/auth/signup", { username, password });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 실패!");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
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
      <button onClick={handleSignup}>가입하기</button>
      <button onClick={() => navigate("/login")}>취소</button>
    </div>
  );
};

export default Signup;
