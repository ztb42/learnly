import { useState } from "react";
import {
	Container,
	Card,
	CardContent,
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

const TrainingPrograms = () => {
	const {
		data: trainings,
		loading,
		deleteItem,
		refetch,
	} = useApi("/api/training-programs");
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
				Trainings
			</Typography>

			<TextField
				label="Search Trainings"
				fullWidth
				sx={{ mb: 4 }}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{loading ? (
				<Progress
					sx={{ marginTop: "3rem", mx: "auto", display: "block" }}
				/>
			) : filteredTrainings.length === 0 ? (
				<Typography
					variant="body1"
					color="textSecondary"
					align="center"
				>
					No training programs found.
				</Typography>
			) : (
				<div className="row">
					{filteredTrainings.map((training) => (
						<div className="col-md-4 mb-4" key={training._id}>
							<Card className="training-card h-100 d-flex flex-column">
								<CardContent className="d-flex flex-column flex-grow-1">
									<Typography variant="h5">
										{training.title}
									</Typography>
									<Typography
										variant="body2"
										className="description-typography"
									>
										{training.description}
									</Typography>
									<Typography variant="body2">
										Duration: {training.duration} weeks
									</Typography>
									<Typography variant="body2">
										Manager:{" "}
										{training.manager
											? `${training.manager.firstName} ${training.manager.lastName}`
											: "Unassigned"}
									</Typography>
									<Typography
										variant="body2"
										className="deadline-typography"
									>
										Deadline:{" "}
										{training.deadline
											? new Date(
													training.deadline
											  ).toLocaleDateString()
											: "No deadline"}
									</Typography>

									<Box
										sx={{
											mt: "auto",
											display: "flex",
											gap: 1,
											justifyContent: "flex-end",
										}}
									>
										<Button
											variant="contained"
											color="primary"
											onClick={() =>
												handleEdit(training._id)
											}
										>
											Edit
										</Button>
										<Button
											variant="outlined"
											color="error"
											onClick={() =>
												handleDeleteClick(training)
											}
										>
											Delete
										</Button>
									</Box>
								</CardContent>
							</Card>
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
