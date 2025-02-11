import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

const ThemeSettings = () => {
  const { mode, color, setMode, setColor } = useTheme();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        테마 설정
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          화면 모드
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && setMode(newMode)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="light">
            <LightModeIcon sx={{ mr: 1 }} />
            라이트
          </ToggleButton>
          <ToggleButton value="dark">
            <DarkModeIcon sx={{ mr: 1 }} />
            다크
          </ToggleButton>
          <ToggleButton value="system">
            <SettingsBrightnessIcon sx={{ mr: 1 }} />
            시스템
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="h6" gutterBottom>
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
                  label={item.label}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </Paper>
    </Box>
  );
};

export default ThemeSettings;
