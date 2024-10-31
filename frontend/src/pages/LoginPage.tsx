import { LoginForm } from "../components/LoginForm";
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const theme = useTheme();

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          background:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          padding: 6,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Welcome to our Online Application Management System. Here you can
          easily submit applications, track progress, and communicate with our
          staff in real-time. We provide convenient file upload features to make
          your application process smoother.
        </Typography>
      </Grid>

      {/* 右侧登录表单区域 */}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#000000",
                mb: 1,
              }}
            >
              Sign In
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Enter your credentials to continue
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <LoginForm />
          </Paper>

          <Box
            sx={{
              mt: 3,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Link
              to="/privacy-policy"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
              sx={{
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
              sx={{
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
