import React, { createContext, useContext, useState, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    logo: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    logo?: React.CSSProperties;
  }
}

type ThemeMode = "light" | "dark" | "system";
export type ThemeColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "cyan";

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
}

const themeColors = {
  blue: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  purple: {
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#ed6c02",
    },
  },
  green: {
    primary: {
      main: "#2e7d32",
    },
    secondary: {
      main: "#0288d1",
    },
  },
  orange: {
    primary: {
      main: "#ed6c02",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  red: {
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#0288d1",
    },
  },
  cyan: {
    primary: {
      main: "#0288d1",
    },
    secondary: {
      main: "#ed6c02",
    },
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [color, setColor] = useState<ThemeColor>("blue");

  const theme = useMemo(() => {
    const themeMode =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode;

    return createTheme({
      palette: {
        mode: themeMode,
        ...themeColors[color],
      },
      typography: {
        fontFamily: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ].join(","),
        logo: {
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 700,
          fontSize: "1.5rem",
          letterSpacing: "0.02em",
        },
        h1: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        h2: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        h3: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        h4: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        h5: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        h6: {
          fontWeight: 600,
          letterSpacing: "-0.025em",
        },
        subtitle1: {
          letterSpacing: "-0.015em",
        },
        subtitle2: {
          letterSpacing: "-0.015em",
        },
        body1: {
          letterSpacing: "-0.015em",
        },
        body2: {
          letterSpacing: "-0.015em",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            @font-face {
              font-family: 'Pretendard';
              font-weight: 400;
              font-display: swap;
              src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
            }
            @font-face {
              font-family: 'Pretendard';
              font-weight: 500;
              font-display: swap;
              src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Medium.woff') format('woff');
            }
            @font-face {
              font-family: 'Pretendard';
              font-weight: 600;
              font-display: swap;
              src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
            }
            @font-face {
              font-family: 'Pretendard';
              font-weight: 700;
              font-display: swap;
              src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff') format('woff');
            }
          `,
        },
      },
    });
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
