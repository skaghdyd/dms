import { Paper, Typography, Box } from "@mui/material";

interface PageTitleProps {
  title: string;
  action?: React.ReactNode;
}

const PageTitle = ({ title, action }: PageTitleProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
        {action}
      </Box>
    </Paper>
  );
};

export default PageTitle;
