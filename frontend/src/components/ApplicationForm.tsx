import React, { useState } from "react";
import { submitApplication } from "../api/applicationApi";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  styled,
  Collapse,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface ApplicationFormData {
  title: string;
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

export const ApplicationForm = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
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
      await submitApplication(formData.title, formData.content);
      setSuccess(true);
      setFormData({
        title: "",
        content: "",
      });
      setExpanded(false);
      onSubmitSuccess();
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          "Submission failed, please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {!expanded ? (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setExpanded(true)}
          variant="contained"
          sx={{ mb: 2 }}
        >
          New Application
        </Button>
      ) : (
        <IconButton onClick={() => setExpanded(false)} sx={{ mb: 2 }}>
          <CloseIcon />
        </IconButton>
      )}

      <Collapse in={expanded}>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Application Title"
            required
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <StyledTextField
            label="Application Content"
            required
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Application"}
          </StyledButton>
        </form>
      </Collapse>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Application submitted successfully!
        </Alert>
      )}
    </Box>
  );
};
