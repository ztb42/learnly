import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Progress from "../components/Progress";
import { useSnackbar } from "notistack";
import TrainingCard from "../components/dashboard/TrainingCard";
import useAuth from "../hooks/useAuth";

const TrainingPrograms = () => {
  const { user } = useAuth();
  const currentRole = user?.role?.roleName;

  let trainingsEndpoint = "/api/training-programs";
  if (currentRole === "Manager") {
    trainingsEndpoint = `/api/training-programs/manager/${user._id}`;
  }

  const {
    data: trainings,
    loading,
    deleteItem,
    refetch,
  } = useApi(trainingsEndpoint);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const filteredTrainings = trainings.filter((training) => {
    const title = training.title?.toLowerCase() || "";
    const description = training.description?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  const handleEdit = (trainingId) => {
    navigate(`/training-programs/${trainingId}/edit`);
  };

  const handleDeleteClick = (training) => {
    setTrainingToDelete(training);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteItem(trainingToDelete._id);
      enqueueSnackbar("Training deleted successfully", {
        variant: "success",
      });
      refetch(); // Refetch the trainings after deletion
    } catch (err) {
      enqueueSnackbar(err || "Failed to delete training", {
        variant: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ p: 2, mt: "3rem" }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Training Programs
      </Typography>

      <TextField
        label="Search Trainings"
        fullWidth
        sx={{ mb: 4 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <Progress sx={{ marginTop: "3rem", mx: "auto", display: "block" }} />
      ) : filteredTrainings.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No training programs found.
        </Typography>
      ) : (
        <div className="row">
          {filteredTrainings.map((training) => (
            <div className="col-md-4 mb-4" key={training._id}>
              <TrainingCard training={training} />
              {currentRole !== "Manager" && (
                <Box sx={{ mt: 1, textAlign: "right" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(training)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <b>{trainingToDelete?.title || "this training"}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainingPrograms;
