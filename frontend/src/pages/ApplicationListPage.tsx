import { Container, Typography, Box } from "@mui/material";
import { ApplicationList } from "../components/ApplicationList";

export const ApplicationListPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Applications List
        </Typography>
      </Box>
      <ApplicationList />
    </Container>
  );
};
