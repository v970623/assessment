import React, { useState } from "react";
import { submitApplication } from "../api/applicationApi";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  styled,
} from "@mui/material";

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

export const ApplicationForm = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await submitApplication(content);
      setSuccess(true);
      setContent("");
    } catch (error) {
      setError("Failed to submit application, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: "10px",
            backgroundColor: "rgba(237, 247, 237, 0.8)",
          }}
        >
          Application submitted successfully!
        </Alert>
      )}

      <StyledTextField
        margin="normal"
        required
        fullWidth
        multiline
        rows={6}
        id="content"
        label="Application Content"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Application"}
      </StyledButton>
    </Box>
  );
};
