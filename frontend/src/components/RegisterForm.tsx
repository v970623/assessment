import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  styled,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  padding: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  "&:hover": {
    background: "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
  },
}));

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError(
        "Please read and agree to the Terms of Service and Privacy Policy"
      );
      return;
    }
    setError("");
    setLoading(true);

    try {
      await registerUser(username, password);
      window.location.href = "/login";
    } catch (error) {
      setError("Registration failed, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "10px",
            backgroundColor: "rgba(253, 237, 237, 0.8)",
          }}
        >
          {error}
        </Alert>
      )}

      <StyledTextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAgreedToTerms(e.target.checked)
            }
            color="primary"
          />
        }
        label={
          <Box sx={{ fontSize: "0.875rem" }}>
            I have read and agree to the
            <Link
              to="/terms-of-service"
              style={{
                color: "#2196F3",
                textDecoration: "none",
                marginLeft: "4px",
                marginRight: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Terms of Service
            </Link>
            and
            <Link
              to="/privacy-policy"
              style={{
                color: "#2196F3",
                textDecoration: "none",
                marginLeft: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>
          </Box>
        }
        sx={{ mt: 2 }}
      />

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading || !agreedToTerms}
      >
        {loading ? <CircularProgress size={24} /> : "Register"}
      </StyledButton>

      <Box
        sx={{
          textAlign: "center",
          "& a": {
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        <Link to="/login">Already have an account? Login now</Link>
      </Box>
    </Box>
  );
};
