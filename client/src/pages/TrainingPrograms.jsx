
// import { useState } from "react";
// import {
// 	Container,
// 	Card,
// 	CardContent,
// 	Typography,
// 	TextField,
// 	Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import useApi from "../hooks/useApi";
// import Progress from "../components/Progress";

// const TrainingPrograms = () => {
// 	const { data: trainings, loading } = useApi("/api/training-programs");
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const navigate = useNavigate();

// 	// Filter trainings based on search
// 	const filteredTrainings = trainings.filter((training) => {
// 		const title = training.title?.toLowerCase() || "";
// 		const description = training.description?.toLowerCase() || "";
// 		const query = searchQuery.toLowerCase();
// 		return title.includes(query) || description.includes(query);
// 	});

// 	const handleEdit = (trainingId) => {
// 		console.log("Redirecting to:", trainingId);
// 		navigate(`/training-programs/${trainingId}/edit`);
// 	};


// 	return (
// 		<Container
// 			className="training-container"
// 			maxWidth="lg"
// 			sx={{ p: 2, mt: "3rem" }}
// 		>
// 			<Typography component="h1" variant="h4" gutterBottom>
// 				Trainings
// 			</Typography>

// 			<TextField
// 				label="Search Trainings"
// 				fullWidth
// 				sx={{ mb: 4 }}
// 				value={searchQuery}
// 				onChange={(e) => setSearchQuery(e.target.value)}
// 			/>

// 			{loading && (
// 				<Progress
// 					sx={{ marginTop: "3rem", mx: "auto", display: "block" }}
// 				/>
// 			)}

// 			{!loading && filteredTrainings.length === 0 ? (
// 				<Typography variant="body1" color="textSecondary" align="center">
// 					No training programs found.
// 				</Typography>
// 			) : (
// 				<div className="row">
// 					{filteredTrainings.map((training) => (
// 						<div className="col-md-4 mb-4" key={training._id}>
// 							<Card className="training-card h-100 d-flex flex-column">
// 								<CardContent className="d-flex flex-column flex-grow-1">
// 									<Typography variant="h5">
// 										{training.title}
// 									</Typography>

// 									<Typography className="description-typography" variant="body2">
// 										{training.description}
// 									</Typography>

// 									<Typography variant="body2">
// 										Duration: {training.duration} weeks
// 									</Typography>

// 									<Typography variant="body2">
// 										Manager: {training.manager
// 											? `${training.manager.firstName} ${training.manager.lastName}`
// 											: "Unassigned"}
// 									</Typography>

// 									<Typography variant="body2">
// 	Trainer: {(training.trainer && training.trainer.firstName)
// 		? `${training.trainer.firstName} ${training.trainer.lastName}`
// 		: "Unassigned"}
// </Typography>


// 									<Typography className="deadline-typography" variant="body2">
// 										Deadline: {training.deadline
// 											? new Date(training.deadline).toLocaleDateString()
// 											: "No deadline"}
// 									</Typography>

// 									<Button
// 										className="button-right"
// 										variant="contained"
// 										color="primary"
// 										onClick={() => handleEdit(training._id)}
// 										sx={{ marginTop: "auto", paddingTop: "10px" }}
// 									>
// 										Edit
// 									</Button>
// 								</CardContent>
// 							</Card>
// 						</div>
// 					))}
// 				</div>
// 			)}
// 		</Container>
// 	);
// };

// export default TrainingPrograms;



import { useState } from "react";
import {
	Container,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Progress from "../components/Progress";

const TrainingPrograms = () => {
	const { data: trainings, loading, refetch } = useApi("/api/training-programs");
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const filteredTrainings = trainings.filter((training) => {
		const title = training.title?.toLowerCase() || "";
		const description = training.description?.toLowerCase() || "";
		const query = searchQuery.toLowerCase();
		return title.includes(query) || description.includes(query);
	});

	const handleEdit = (trainingId) => {
		navigate(`/training-programs/${trainingId}/edit`);
	};

	const handleDelete = async (trainingId) => {
		if (!window.confirm("Are you sure you want to delete this training?")) return;

		try {
			const res = await fetch(`http://localhost:5050/api/training-programs/${trainingId}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (!res.ok) {
				alert(data.message || "Failed to delete training");
			} else {
				alert("Training deleted");
				refetch(); // refresh data from API
			}
		} catch (err) {
			console.error("Error deleting training:", err);
			alert("Server error: " + err.message);
		}
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
				<Progress sx={{ marginTop: "3rem", mx: "auto", display: "block" }} />
			) : filteredTrainings.length === 0 ? (
				<Typography variant="body1" color="textSecondary" align="center">
					No training programs found.
				</Typography>
			) : (
				<div className="row">
					{filteredTrainings.map((training) => (
						<div className="col-md-4 mb-4" key={training._id}>
							<Card className="training-card h-100 d-flex flex-column">
								<CardContent className="d-flex flex-column flex-grow-1">
									<Typography variant="h5">{training.title}</Typography>
									<Typography variant="body2" className="description-typography">
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
									<Typography variant="body2">
										Trainer:{" "}
										{training.trainer
											? `${training.trainer.firstName} ${training.trainer.lastName}`
											: "Unassigned"}
									</Typography>
									<Typography variant="body2" className="deadline-typography">
										Deadline:{" "}
										{training.deadline
											? new Date(training.deadline).toLocaleDateString()
											: "No deadline"}
									</Typography>

									<Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={() => handleEdit(training._id)}
										>
											Edit
										</Button>
										<Button
											variant="outlined"
											color="error"
											fullWidth
											onClick={() => handleDelete(training._id)}
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
		</Container>
	);
};

export default TrainingPrograms;
