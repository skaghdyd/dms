import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import TaskIcon from "@mui/icons-material/Task";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const currentMenuItems =
    menuItems[currentTab as keyof typeof menuItems] || [];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? 240 : 72,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: open ? 240 : 72,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            borderRight: `1px solid ${
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.12)"
                : "rgba(255, 255, 255, 0.12)"
            }`,
            bgcolor: theme.palette.background.paper,
            overflowX: "hidden",
            transition: theme.transitions.create(["width", "opacity"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
        open={open}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
              mb: 1,
              minHeight: 48,
            }}
          >
            {open && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  px: 2,
                  py: 1,
                  marginRight: 5,
                  opacity: 0,
                  animation: open
                    ? `fadeIn 0.3s ease-in-out 0.1s forwards`
                    : "none",
                  "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                }}
              >
                {menuTitles[currentTab as keyof typeof menuTitles]}
              </Typography>
            )}
            <IconButton
              onClick={onToggle}
              sx={{
                position: "absolute",
                right: open ? 8 : "50%",
                transform: open ? "none" : "translateX(50%)",
                transition: theme.transitions.create(["right", "transform"], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          <Divider />
          <List>
            {currentMenuItems.map((item, index) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleMenuClick(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    justifyContent: open ? "initial" : "center",
                    minHeight: 48,
                    px: 2.5,
                    width: "100%",
                    opacity: 0,
                    animation: open
                      ? `fadeIn 0.3s ease-in-out ${
                          0.1 + index * 0.05
                        }s forwards`
                      : "none",
                    "@keyframes fadeIn": {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                    transition: theme.transitions.create(
                      ["padding-left", "padding-right", "width"],
                      {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                      }
                    ),
                    ...(open
                      ? {
                          pl: 2.5,
                          pr: 2.5,
                        }
                      : {
                          pl: 0.8,
                          pr: 0,
                        }),
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                    "&.Mui-selected": {
                      bgcolor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      width: 24,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: theme.transitions.create(
                          ["opacity", "width"],
                          {
                            easing: theme.transitions.easing.easeInOut,
                            duration: theme.transitions.duration.standard,
                          }
                        ),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{
            width: "100%",
            "& .MuiAlert-icon": {
              color: "white",
            },
            color: "white",
          }}
        >
          해당 기능은 현재 개발 중입니다.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;
