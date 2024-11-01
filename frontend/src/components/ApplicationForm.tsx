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

interface ApplicationFormData {
  content: string;
}

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#666",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#666",
    },
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  padding: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  backgroundColor: "#000000",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#333333",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3)",
  },
  "&:disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export const ApplicationForm = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await submitApplication(formData.content);
      setSuccess(true);
      // 重置表单
      setFormData({
        content: "",
      });
    } catch (error) {
      setError("Failed to submit application. Please try again later.");
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
        value={formData.content}
        onChange={handleChange}
        placeholder="Please enter your application details..."
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
