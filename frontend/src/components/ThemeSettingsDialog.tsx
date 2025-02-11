import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Radio,
  FormControlLabel,
  RadioGroup,
  Box,
  IconButton,
} from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CloseIcon from "@mui/icons-material/Close";

interface ThemeSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

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

        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            테마 색상
          </Typography>
          <RadioGroup
            value={color}
            onChange={(e) => setColor(e.target.value as any)}
          >
            <Grid container spacing={2}>
              {[
                { value: "blue", label: "블루", color: "#1976d2" },
                { value: "purple", label: "퍼플", color: "#7b1fa2" },
                { value: "green", label: "그린", color: "#2e7d32" },
                { value: "orange", label: "오렌지", color: "#ed6c02" },
              ].map((item) => (
                <Grid item xs={6} key={item.value}>
                  <FormControlLabel
                    value={item.value}
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: item.color,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            mr: 1,
                          }}
                        />
                        {item.label}
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettingsDialog;
