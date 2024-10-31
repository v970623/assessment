import React from "react";
import { ApplicationForm } from "../components/ApplicationForm";
import { Container, Paper, Typography, Box, useTheme } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const ApplicationPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 1,
              }}
            >
              <DescriptionOutlinedIcon sx={{ color: "white" }} />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              提交申请
            </Typography>
          </Box>
          <ApplicationForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default ApplicationPage;