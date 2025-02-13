import axios from "axios";

const api = axios.create({});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
