import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Box,
  Chip,
  Typography,
  Paper,
} from "@mui/material";
import { getApplications } from "../api/applicationApi";
import { format } from "date-fns";

interface Application {
  _id: string;
  content: string;
  status: string;
  userId: {
    username: string;
    email: string;
  };
  createdAt: string;
}

const getStatusColor = (
  status: string
): "info" | "warning" | "success" | "error" => {
  const colors = {
    new: "info",
    pending: "warning",
    accepted: "success",
    rejected: "error",
  } as const;
  return colors[status as keyof typeof colors] || "default";
};

export const ApplicationList = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Applicant</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submit Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications
            // 例如:
            // page = 0, rowsPerPage = 10
            // .slice(0, 10) - 返回前10条记录
            // page = 1, rowsPerPage = 10
            // .slice(10, 20) - 返回第11-20条记录
            // page = 2, rowsPerPage = 10
            // .slice(20, 30) - 返回第21-30条记录
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((application) => (
              <TableRow key={application._id}>
                <TableCell>{application.userId.username}</TableCell>
                <TableCell>
                  <Typography noWrap sx={{ maxWidth: 300 }}>
                    {application.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(application.createdAt), "yyyy-MM-dd HH:mm")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={applications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
