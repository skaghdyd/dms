import { Snackbar, Alert } from "@mui/material";

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const AlertSnackbar = ({
  open,
  message,
  severity,
  onClose,
}: AlertSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        bottom: { xs: "80px", sm: "100px" },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          minWidth: "300px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          "& .MuiAlert-icon": {
            fontSize: "24px",
          },
          "&.MuiAlert-standardSuccess": {
            backgroundColor: "#E7F6E7",
            color: "#1E4620",
            "& .MuiAlert-icon": {
              color: "#2E7D32",
            },
          },
          "&.MuiAlert-standardError": {
            backgroundColor: "#FDEDED",
            color: "#5F2120",
            "& .MuiAlert-icon": {
              color: "#D32F2F",
            },
          },
          fontSize: "1rem",
          padding: "12px 24px",
        }}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
