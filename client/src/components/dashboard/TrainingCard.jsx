import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TrainingCard = ({ training }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserRole = user?.role?.roleName || "";

  const managerName = training.manager
    ? `${training.manager.firstName} ${training.manager.lastName}`
    : "Unassigned";

  const handleCardClick = () => {
    navigate(`/training-programs/${training._id}`);
  };

  const handleEdit = (trainingId) => {
    navigate(`/training-programs/${trainingId}/edit`);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 2,

        cursor: "pointer",
        "&:hover": { boxShadow: 3 },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Typography variant="h6">{training.title}</Typography>
        <Typography variant="body2" sx={{ color: "darkgray" }}>
          {training.description}
        </Typography>

        {["Admin", "Trainer"].includes(currentUserRole) && (
          <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
            Manager: {managerName}
          </Typography>
        )}

        <Divider sx={{ my: 2, opacity: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ClockIcon color="primary" />
          <Typography
            variant="body2"
            sx={{
              color: "darkgray",
              flex: 1,
              marginLeft: "1rem",
            }}
          >
            Duration: {training.duration} weeks
          </Typography>
          {/* <Chip label="Enrolled" color="primary" />  */}

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(training._id)}
          >
            Edit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
