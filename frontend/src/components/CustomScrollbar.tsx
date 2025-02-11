import { styled } from "@mui/material/styles";

const CustomScrollbar = styled("div")(({ theme }) => ({
  overflow: "overlay",
  scrollbarGutter: "stable",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
    marginTop: "4px",
    marginBottom: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    "&:hover": {
      background:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.3)"
          : "rgba(255, 255, 255, 0.3)",
    },
  },
  scrollbarWidth: "thin",
  scrollbarColor:
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.2) transparent"
      : "rgba(255, 255, 255, 0.2) transparent",
}));

export default CustomScrollbar;
