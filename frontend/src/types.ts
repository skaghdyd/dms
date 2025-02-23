// 사용자 타입
export interface User {
  id: number;
  username: string;
  role: string;
}

// 파일 정보 타입
export interface FileInfo {
  id: number;
  originalFileName: string;
  fileSize: number;
}

// 문서 타입
export interface Document {
  id: number;
  title: string;
  content: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  files: FileInfo[];
  folderId: number | null;
  isStarred: boolean; // 중요 문서 여부
  folder?: Folder; // 속한 폴더 (선택적)
}

// 폴더 타입
export interface Folder {
  id: number;
  name: string;
  documentCount: number; // 폴더 내 문서 수
  createdAt: string;
  updatedAt: string;
}
