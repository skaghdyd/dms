import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import { ThemeColor, useTheme } from "../contexts/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";

interface ThemeSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const themeColors = [
  { name: "blue", color: "#1976d2" },
  { name: "purple", color: "#9c27b0" },
  { name: "green", color: "#2e7d32" },
  { name: "orange", color: "#ed6c02" },
  { name: "red", color: "#d32f2f" },
  { name: "cyan", color: "#0288d1" },
];

const ThemeSettingsDialog = ({ open, onClose }: ThemeSettingsDialogProps) => {
  const { mode, color, setMode, setColor } = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        테마 설정
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            화면 모드
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => newMode && setMode(newMode)}
            sx={{ width: "100%", mb: 1 }}
          >
            <ToggleButton value="light" sx={{ flex: 1 }}>
              <LightModeIcon sx={{ mr: 1 }} />
              라이트
            </ToggleButton>
            <ToggleButton value="dark" sx={{ flex: 1 }}>
              <DarkModeIcon sx={{ mr: 1 }} />
              다크
            </ToggleButton>
            <ToggleButton value="system" sx={{ flex: 1 }}>
              <SettingsBrightnessIcon sx={{ mr: 1 }} />
              시스템
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            테마 색상
          </Typography>
          <Grid container spacing={1}>
            {themeColors.map((themeColor) => (
              <Grid item key={themeColor.name}>
                <IconButton
                  onClick={() => setColor(themeColor.name as ThemeColor)}
                  sx={{
                    width: 40,
                    height: 40,
                    color: themeColor.color,
                    border: color === themeColor.name ? 2 : 0,
                    borderColor: themeColor.color,
                    p: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 24,
                    },
                  }}
                >
                  <CircleIcon />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettingsDialog;
