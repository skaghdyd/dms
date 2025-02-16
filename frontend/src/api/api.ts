import axios from "axios";

const api = axios.create({
  baseURL: "/api", // API 기본 URL 설정
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
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
      sessionStorage.removeItem("token");
      alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 파일 업로드 함수
const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(progress);
      }
    },
  } as any);
};

// 문서 생성
const createDocument = async (formData: FormData) => {
  // FormData에서 파일 데이터 확인
  const files = formData.getAll("files");

  // 파일이 없는 경우 JSON으로 요청
  if (files.length === 0) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    return api.post(
      "/documents",
      {
        title,
        content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 파일이 있는 경우 multipart/form-data로 요청
  return api.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 문서 수정
const updateDocument = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/documents/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization 헤더는 인터셉터에서 자동으로 추가됨
      },
    });
    return response.data;
  } catch (error) {
    console.error("문서 수정 에러:", error);
    throw error;
  }
};

// 파일 다운로드
const downloadFile = async (fileId: number, originalFileName: string) => {
  const response = await api.get<Blob>(`/files/download/${fileId}`, {
    responseType: "blob",
  });

  // Blob URL 생성
  const url = window.URL.createObjectURL(new Blob([response.data]));

  // 임시 링크 생성
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", originalFileName); // 원본 파일명 사용

  // 링크 클릭 시뮬레이션
  document.body.appendChild(link);
  link.click();

  // 임시 요소 제거
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 파일 삭제
const deleteFile = async (fileId: number) => {
  return api.delete(`/files/${fileId}`);
};

export default {
  ...api,
  uploadFile,
  createDocument,
  updateDocument,
  downloadFile,
  deleteFile,
};
