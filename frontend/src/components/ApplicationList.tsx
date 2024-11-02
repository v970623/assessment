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
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  getApplications,
  updateApplicationStatus,
} from "../api/applicationApi";
import { format } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

interface Props {
  userRole: "staff" | "public";
}

export const ApplicationList = ({ userRole }: Props) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  console.log("ApplicationList received userRole:", userRole);

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
      await fetchApplications(); // Refresh list
      handleStatusClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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
            {userRole === "staff" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {applications
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
  );
};
