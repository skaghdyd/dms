import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AllDocuments from "../pages/AllDocuments";
import FolderDocuments from "../pages/FolderDocuments";
import StarredDocuments from "../pages/StarredDocuments";
import RecentDocuments from "../pages/RecentDocuments";
import Boards from "../pages/Boards";
import PostForm from "../pages/PostForm";
import PostDetail from "../pages/PostDetail";
import ErrorBoundary from "../components/ErrorBoundary";
import UnderDevelopment from "../pages/UnderDevelopment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/documents" replace />,
      },
      {
        path: "documents",
        children: [
          {
            path: "",
            element: <AllDocuments />,
          },
          {
            path: "folders",
            element: <FolderDocuments />,
          },
          {
            path: "starred",
            element: <StarredDocuments />,
          },
          {
            path: "recent",
            element: <RecentDocuments />,
          },
        ],
      },
      {
        path: "boards",
        children: [
          {
            index: true,
            element: <Navigate to="/boards/general" replace />,
          },
          {
            path: "general",
            element: <Boards />,
          },
          {
            path: "department",
            element: <UnderDevelopment title="부서게시판" />,
          },
          {
            path: "new",
            element: <PostForm />,
          },
          {
            path: "posts/:id",
            element: <PostDetail />,
          },
          {
            path: "edit/:id",
            element: <PostForm />,
          },
        ],
      },
      {
        path: "calendar",
        children: [
          {
            index: true,
            element: <Navigate to="/calendar/monthly" replace />,
          },
          {
            path: "monthly",
            element: <UnderDevelopment title="월간 일정" />,
          },
          {
            path: "events",
            element: <UnderDevelopment title="주요 행사" />,
          },
          {
            path: "tasks",
            element: <UnderDevelopment title="업무 일정" />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
