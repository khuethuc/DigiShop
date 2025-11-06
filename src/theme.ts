// src/theme.ts
import { createTheme, alpha } from "@mui/material/styles";

const BRAND_BLUE = "#2C7FFF";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: BRAND_BLUE },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "#e5e7eb",
  },

  shape: { borderRadius: 10 },

  typography: {
    fontFamily:
      '"Vazirmatn", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    button: { textTransform: "none", fontWeight: 600 },
    body1: { fontSize: 18, lineHeight: 1.75 },
    body2: { fontSize: 16, lineHeight: 1.5 },
    h6: { fontWeight: 700, fontSize: 22 },
    h1: {fontWeight: 600}
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: (t) => ({
        "*, *::before, *::after": { boxSizing: "border-box" },
        body: {
          backgroundColor: t.palette.background.default,
          color: t.palette.text.primary,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      }),
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          height: 40,
          paddingInline: 16,
          // tăng specificity để thắng global .uppercase (không cần !important)
          "&&": { textTransform: "none" as const },
          // phòng trường hợp chữ trong span con bị ảnh hưởng
          "& *": { textTransform: "none" as const },
        },
        containedPrimary: ({ theme }) => ({
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
          },
          "&:active": { transform: "translateY(0.5px)" },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.default,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 9999,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }),
        input: { paddingBlock: 11 },
      },
    },

    MuiLink: { defaultProps: { underline: "hover", color: "inherit" } },

    MuiPaper: {
      styleOverrides: {
        outlined: ({ theme }) => ({ borderColor: theme.palette.divider }),
        elevation1: () => ({
          border: `1px solid #e5e7eb`,
          boxShadow:
            `0 10px 20px -10px ${alpha("#111827", 0.15)}, ` +
            `0 6px 12px -6px ${alpha("#111827", 0.1)}`,
        }),
      },
    },
  },
});

export default theme;
