import { useState } from "react";
import {
	Container,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
} from "@mui/material";
import useApi from "../hooks/useApi";
import Progress from "../components/Progress";

const TrainingPrograms = () => {
	const { data: trainings, loading } = useApi("/api/training-programs");

	const [searchQuery, setSearchQuery] = useState("");

	// Filter trainings based on search
	const filteredTrainings = trainings.filter(
		(training) =>
			training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			training.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	const handleEdit = (trainingId) => {
		console.log("Editing training program with ID:", trainingId);
		//add form to edit course
	};

	return (
		<Container
			className="training-container"
			maxWidth="lg"
			sx={{ p: 2, mt: "3rem" }}
		>
			<Typography component="h1" variant="h4" gutterBottom>
				Courses
			</Typography>

			<TextField
				label="Search Courses"
				fullWidth
				sx={{ mb: 4 }}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{loading && (
				<Progress
					sx={{ marginTop: "3rem", mx: "auto", display: "block" }}
				/>
			)}

			{!loading && filteredTrainings.length === 0 ? (
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
										className="description-typography"
										variant="body2"
									>
										{training.description}
									</Typography>
									<Typography variant="body2">
										Duration: {training.duration} weeks
									</Typography>
									<Typography variant="body2">
										Manager ID: {training.manager}{" "}
										{/* Display as ID for now */}
									</Typography>
									<Typography
										className="deadline-typography"
										variant="body2"
									>
										Deadline:{" "}
										{new Date(
											training.deadline
										).toLocaleDateString()}
									</Typography>

									{/* Edit Button */}
									<Button
										className="button-right"
										variant="contained"
										color="primary"
										onClick={() => handleEdit(training._id)}
										sx={{
											marginTop: "auto",
											paddingTop: "10px",
										}}
									>
										Edit
									</Button>
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
