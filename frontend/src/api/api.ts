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

// 폴더 관련 API
export const folderApi = {
  // 폴더 목록 조회
  getFolders: () => api.get("/folders"),

  // 폴더 생성
  createFolder: (name: string) => api.post("/folders", { name }),

  // 폴더 수정
  updateFolder: (id: number, name: string) =>
    api.put(`/folders/${id}`, { name }),

  // 폴더 삭제
  deleteFolder: (id: number) => api.delete(`/folders/${id}`),
};

// 문서 관련 API 확장
export const documentApi = {
  // 기존 API들...
  getAllDocuments: () => api.get("/documents"),
  getDocumentById: (id: number) => api.get(`/documents/${id}`),

  // 문서 생성
  createDocument: async (formData: FormData) => {
    try {
      const response = await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("문서 생성 에러:", error);
      throw error;
    }
  },

  // 문서 수정
  updateDocument: async (id: number, formData: FormData) => {
    try {
      const response = await api.put(`/documents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("문서 수정 에러:", error);
      throw error;
    }
  },

  // 문서 삭제
  deleteDocument: (id: number) => api.delete(`/documents/${id}`),

  // 폴더별 문서 조회
  getDocumentsByFolder: (folderId: number) =>
    api.get(`/documents/folder/${folderId}`),

  // 중요 문서 조회
  getStarredDocuments: () => api.get("/documents/starred"),

  // 최근 문서 조회
  getRecentDocuments: () => api.get("/documents/recent"),
};

export default {
  ...documentApi,
  ...folderApi,
  ...api,
  uploadFile,
  downloadFile,
  deleteFile,
};
