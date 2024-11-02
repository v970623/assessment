import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
  Button,
  Menu,
  MenuItem,
  IconButton,
  Alert,
} from "@mui/material";
import {
  getApplications,
  updateApplicationStatus,
  searchApplications,
} from "../api/applicationApi";
import { format } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { jwtDecode } from "jwt-decode";
import { ApplicationSearch } from "./ApplicationSearch";
import { Application, DecodedToken, SearchParams } from "../types/application";

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

interface Props {
  userRole: "staff" | "public";
}

export const ApplicationList = forwardRef(({ userRole }: Props, ref) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [error, setError] = useState("");
  console.log("ApplicationList received userRole:", userRole);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      if (userRole === "public") {
        const userId = jwtDecode<DecodedToken>(
          localStorage.getItem("token")!
        ).id;
        setApplications(
          response.data.filter((app) => app.userId._id === userId)
        );
      } else {
        setApplications(response.data);
      }
    } catch (error) {
      setError("Failed to fetch applications");
      console.error(error);
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

  const handleStatusClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateApplicationStatus(selectedId, newStatus);
      await fetchApplications();
      handleStatusClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    try {
      const response = await searchApplications(params);
      if (userRole === "public") {
        const userId = jwtDecode<DecodedToken>(
          localStorage.getItem("token")!
        ).id;
        setApplications(
          response.data.filter((app) => app.userId._id === userId)
        );
      } else {
        setApplications(response.data);
      }
    } catch (error) {
      setError("搜索失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchApplications,
  }));

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <ApplicationSearch onSearch={handleSearch} />
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submit Time</TableCell>
              {userRole === "staff" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((application) => (
                <TableRow key={application._id}>
                  <TableCell>{application.userId.username}</TableCell>
                  <TableCell>{application.title}</TableCell>
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
                    {format(
                      new Date(application.createdAt),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </TableCell>
                  {userRole === "staff" && (
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleStatusClick(e, application._id)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleStatusClose}
        >
          <MenuItem onClick={() => handleStatusUpdate("pending")}>
            Pending
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate("accepted")}>
            Accepted
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate("rejected")}>
            Rejected
          </MenuItem>
        </Menu>

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
    </Box>
  );
});
