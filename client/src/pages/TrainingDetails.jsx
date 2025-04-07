
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import ColoredAvatar from "../components/ColoredAvatar";
import useApi from "../hooks/useApi";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const TrainingDetails = () => {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [assignmentIdMap, setAssignmentIdMap] = useState({});
  const [completedEmployees, setCompletedEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: users, loading: usersLoading } = useApi("/api/users");
  const { data: roles } = useApi("/api/roles");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentRole = currentUser?.role?.roleName.toLowerCase();

  const employeeRole = roles.find((role) => role.roleName.toLowerCase() === "employee");
  const allEmployees = users.filter((user) => user.role._id === employeeRole?._id);

  const fetchAssignedEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/training/${id}/employees`);
      const data = await res.json();
      setAssignedEmployees(data);
    } catch (err) {
      console.error("Failed to fetch assigned employees:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/training/${id}`);
      const data = await res.json();
      const map = {};
      data.forEach((a) => {
        map[a.employee._id] = a._id;
      });
      setAssignmentIdMap(map);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  const handleAssignEmployee = async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE}/api/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee: employeeId,
          training: id,
          assignedByManager: currentUser._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error assigning employee");
      }

      await fetchAssignedEmployees();
      await fetchAssignments();
      setOpenDialog(false);
    } catch (err) {
      console.error("Error assigning employee:", err);
      alert("Failed to assign employee: " + err.message);
    }
  };

  const handleEnroll = async (sessionId) => {
    try {
      const assignmentId = assignmentIdMap[currentUser._id];

      if (!assignmentId) {
        alert("You must be assigned to this training before enrolling.");
        return;
      }

      const response = await fetch(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session: sessionId, assignment: assignmentId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Successfully enrolled in the session!");
      } else {
        alert("Failed to enroll: " + data.error);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Error enrolling in session.");
    }
  };

  const handleMarkComplete = async (employeeId) => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/complete/${id}/${employeeId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setAssignedEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
        setCompletedEmployees((prev) => [...prev, employeeId]);
        alert("Marked as complete and assignment removed.");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Failed to mark as complete:", err);
      alert("Error marking complete");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTraining = await fetch(`${API_BASE}/api/training-programs/${id}`);
        const trainingData = await resTraining.json();

        const resSessions = await fetch(`${API_BASE}/api/training-sessions/program/${id}`);
        const sessionsData = await resSessions.json();

        setTraining({ ...trainingData, sessions: sessionsData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchAssignedEmployees();
    fetchAssignments();
  }, [id]);

  if (loading || usersLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          {training.title}
        </Typography>
        {(currentRole === "admin" || currentRole === "manager") && (
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Assign to Training
          </Button>
        )}
      </Box>

      <Typography variant="h6" mt={4} mb={1}>Sessions</Typography>
      <Grid container spacing={2} mb={4}>
        {(training.sessions || []).map((session) => (
          <Grid item xs={12} sm={4} key={session._id}>
            <Card>
              <CardContent>
                <Typography>📅 {new Date(session.sessionDate).toLocaleDateString()}</Typography>
                <Typography>🕒 {session.sessionTime}</Typography>
                <Typography>👤 Trainer: {session.trainer ? `${session.trainer.firstName} ${session.trainer.lastName}` : "Unassigned"}</Typography>
                {currentRole === "employee" && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleEnroll(session._id)}
                  >
                    Enroll
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(currentRole !== "employee") && (
        <>
          <Typography variant="h6" mb={2}>Assigned Employees</Typography>
          {assignedEmployees.length === 0 ? (
            <Typography variant="body2" color="textSecondary" ml={2}>
              No employees assigned to this training.
            </Typography>
          ) : (
            assignedEmployees.map((employee) => (
              <Card variant="outlined" sx={{ mt: 2, p: 2 }} key={employee._id}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ColoredAvatar name={`${employee.firstName} ${employee.lastName}`} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body1">
                        {`${employee.firstName} ${employee.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                  {currentRole === "trainer" && (
                    <Button color="success" variant="outlined" onClick={() => handleMarkComplete(employee._id)}>
                      Mark as completed
                    </Button>
                  )}
                </Box>
              </Card>
            ))
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Employee to Training</DialogTitle>
        <DialogContent>
          <List>
            {allEmployees.map((emp) => (
              <ListItem
                button
                key={emp._id}
                onClick={() => handleAssignEmployee(emp._id)}
              >
                <ListItemText primary={`${emp.firstName} ${emp.lastName}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainingDetails;