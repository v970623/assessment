import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { getApplications } from "../api/applicationApi";

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

const ApplicationList = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [page, rowsPerPage]);

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
    return <CircularProgress />;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Application ID</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Applicant</TableCell>
            <TableCell>Submit Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((application) => (
              <TableRow key={application._id}>
                <TableCell>{application._id}</TableCell>
                <TableCell>{application.content}</TableCell>
                <TableCell>{application.status}</TableCell>
                <TableCell>{application.userId.username}</TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={applications.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ApplicationList;
