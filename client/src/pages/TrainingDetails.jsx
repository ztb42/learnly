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
  Chip,
} from "@mui/material";
import ColoredAvatar from "../components/ColoredAvatar";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const TrainingDetails = () => {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const assignmentId = "67f2df3fef2bd832582a0cf2";

  const handleEnroll = async () => {
    if (!training.sessions || training.sessions.length === 0) {
      alert("No sessions available for enrollment.");
      return;
    }

    const firstSessionId = training.sessions[0]._id;

    try {
      const response = await fetch(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment: assignmentId,
          session: firstSessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully enrolled in the first session!");
      } else {
        alert("Failed to enroll: " + data.error);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Error enrolling in session.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch training program
        const resTraining = await fetch(
          `${API_BASE}/api/training-programs/${id}`
        );
        if (!resTraining.ok) throw new Error("Training not found");
        const trainingData = await resTraining.json();

        // Fetch sessions by program ID
        const resSessions = await fetch(
          `${API_BASE}/api/training-sessions/program/${id}`
        );
        if (!resSessions.ok) throw new Error("Sessions not found");
        const sessionsData = await resSessions.json();

        // Combine both into one object
        setTraining({ ...trainingData, sessions: sessionsData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // <-- run the combined fetch
  }, [id]);

  useEffect(() => {
    const fetchAssignedEmployees = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/assignments/training/${id}/employees`
        );
        const data = await res.json();
        setAssignedEmployees(data);
      } catch (err) {
        console.error("Failed to fetch assigned employees:", err);
      }
    };

    fetchAssignedEmployees();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* Title and Enroll */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          {training.title}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleEnroll}>
          ENROLL
        </Button>
      </Box>

      {/* Metadata Row */}
      <Box display="flex" justifyContent="space-between" mt={3} mb={2}>
        <Typography variant="subtitle2">
          <b>About</b>
          <br />
          Web App
        </Typography>
        <Typography variant="subtitle2">
          <b>Manager</b>
          <br />
          {training.manager
            ? `${training.manager.firstName} ${training.manager.lastName}`
            : "Unassigned"}
        </Typography>
        <Typography variant="subtitle2">
          <b>Lessons</b>
          <br />
          {training.duration || 0}
        </Typography>
        <Typography variant="subtitle2">
          <b>Schedule</b>
          <br />
          Class Times
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body1" color="text.secondary" mb={4}>
        {training.description}
      </Typography>

      {/* Sessions */}
      <Typography variant="h6" mb={1}>
        Sessions
      </Typography>

      {(() => {
        const weekOrder = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const usedSessions = [...(training.sessions || [])]
          .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
          .slice(0, training.duration || 0); // Only sessions used in Lessons

        const sessionsMap = new Map();

        usedSessions.forEach((session) => {
          const date = new Date(session.sessionDate);
          const day = date.toLocaleDateString("en-US", { weekday: "long" });
          const time = session.sessionTime?.trim().replace(/["']/g, "");
          const trainerName = session.trainer
            ? `${session.trainer.firstName} ${session.trainer.lastName}`
            : "Unassigned";

          if (!sessionsMap.has(day)) {
            sessionsMap.set(day, { time, trainer: trainerName });
          }
        });

        const sortedSessions = weekOrder
          .filter((day) => sessionsMap.has(day))
          .map((day) => ({
            day,
            ...sessionsMap.get(day),
          }));

        return (
          <Grid container spacing={2} mb={4}>
            {sortedSessions.map((s, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography>📅 {s.day}</Typography>
                    <Typography>🕒 {s.time}</Typography>
                    <Typography>👤 Trainer: {s.trainer}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      })()}

      {/* Employees Assigned */}

      <Typography variant="h6" mb={2}>
        Assigned Employees
      </Typography>

      {assignedEmployees.length === 0 ? (
        <Typography variant="body2" color="textSecondary" ml={2}>
          No employees assigned to this training.
        </Typography>
      ) : (
        assignedEmployees.map((employee) => (
          <Card variant="outlined" sx={{ mt: 2, p: 2 }} key={employee._id}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ColoredAvatar
                name={`${employee.firstName} ${employee.lastName}`}
              />
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <Typography variant="body1">
                  {`${employee.firstName} ${employee.lastName}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {employee.email}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))
      )}

      {/* Lessons
      <Typography variant="h6" mb={1}>
        Lessons
      </Typography>
      <Grid container spacing={2}>
        {[...Array(training.duration || 0)].map((_, index) => {
          const sortedSessions = [...(training.sessions || [])].sort(
            (a, b) => new Date(a.sessionDate) - new Date(b.sessionDate)
          );

          const session = sortedSessions[index];

          return (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ backgroundColor: "#111", color: "#fff" }}>
                <CardContent>
                  <Typography>Lesson {index + 1}</Typography>
                  {session ? (
                    <>
                      <Typography variant="body2">
                        Time: {session.sessionTime}
                      </Typography>
                      <Typography variant="body2">
                        Date:{" "}
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="gray">
                      No session info
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid> */}
    </Container>
  );
};

export default TrainingDetails;
