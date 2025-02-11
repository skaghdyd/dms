import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import TaskIcon from "@mui/icons-material/Task";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface SidebarProps {
  open: boolean;
  currentTab: string;
  onToggle: () => void;
}

const menuItems = {
  documents: [
    {
      id: "all",
      title: "전체 문서",
      icon: <DescriptionIcon />,
      path: "/documents",
    },
    {
      id: "folders",
      title: "폴더별 문서",
      icon: <FolderIcon />,
      path: "/documents/folders",
    },
    {
      id: "starred",
      title: "중요 문서",
      icon: <StarIcon />,
      path: "/documents/starred",
    },
    {
      id: "recent",
      title: "최근 문서",
      icon: <AccessTimeIcon />,
      path: "/documents/recent",
    },
  ],
  boards: [
    {
      id: "notice",
      title: "공지사항",
      icon: <AnnouncementIcon />,
      path: "/boards/notice",
    },
    {
      id: "general",
      title: "일반게시판",
      icon: <QuestionAnswerIcon />,
      path: "/boards/general",
    },
    {
      id: "department",
      title: "부서게시판",
      icon: <GroupsIcon />,
      path: "/boards/department",
    },
  ],
  calendar: [
    {
      id: "monthly",
      title: "월간 일정",
      icon: <CalendarMonthIcon />,
      path: "/calendar/monthly",
    },
    {
      id: "events",
      title: "주요 행사",
      icon: <EventIcon />,
      path: "/calendar/events",
    },
    {
      id: "tasks",
      title: "업무 일정",
      icon: <TaskIcon />,
      path: "/calendar/tasks",
    },
  ],
};

const menuTitles = {
  documents: "문서 관리",
  boards: "게시판",
  calendar: "일정 관리",
};

const Sidebar = ({ open, currentTab, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const currentMenuItems =
    menuItems[currentTab as keyof typeof menuItems] || [];
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            borderRight:
              theme.palette.mode === "light"
                ? "1px solid rgba(0, 0, 0, 0.12)"
                : "1px solid rgba(255, 255, 255, 0.12)",
            top: "64px", // 헤더 높이만큼 여백
            height: "calc(100% - 64px)", // 전체 높이에서 헤더 높이 제외
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {menuTitles[currentTab as keyof typeof menuTitles]}
            </Typography>
          </Box>
          <Divider />
          <List>
            {currentMenuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <IconButton
        onClick={onToggle}
        size="small"
        sx={{
          position: "fixed",
          left: open ? 240 : 0,
          top: 84,
          width: 16,
          height: 32,
          borderRadius: open ? "0 4px 4px 0" : "4px",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : theme.palette.background.default,
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.12)"
              : "1px solid rgba(255, 255, 255, 0.12)",
          borderLeft: open ? 0 : undefined,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 4px rgba(0,0,0,0.05)"
              : "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.action.hover,
          },
          transition: theme.transitions.create(["left", "background-color"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer + 1, // 드로어 위에 표시
        }}
      >
        {open ? (
          <ChevronLeftIcon sx={{ fontSize: 14 }} />
        ) : (
          <ChevronRightIcon sx={{ fontSize: 14 }} />
        )}
      </IconButton>
    </Box>
  );
};

export default Sidebar;
