// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
// 	Container,
// 	Typography,
// 	Box,
// 	Divider,
// 	List,
// 	ListItem,
// 	ListItemText,
// } from "@mui/material";

// const TrainingDescription = () => {
// 	const { id } = useParams();
// 	const [training, setTraining] = useState(null);
// 	const [trainingList, setTrainingList] = useState([]);

// 	useEffect(() => {
// 		// Obtener el curso actual
// 		fetch(`http://localhost:5000/trainings/${id}`)
// 			.then((res) => res.json())
// 			.then(setTraining);

// 		// Obtener todos los cursos
// 		fetch("http://localhost:5000/trainings")
// 			.then((res) => res.json())
// 			.then(setTrainingList);
// 	}, [id]);

// 	if (!training) return <Typography>Loading...</Typography>;

// 	return (
// 		<Container maxWidth="md">
// 			<Typography variant="h4" gutterBottom>
// 				{training.title}
// 			</Typography>
// 			<Typography>Date: {training.date}</Typography>
// 			<Typography>
// 				Time: {training.startTime} - {training.endTime}
// 			</Typography>
// 			<Typography>Description: {training.description}</Typography>
// 			<Typography>Training: {training.training}</Typography>
// 			<Typography>Manager: {training.manager}</Typography>
// 			<Typography>Trainer: {training.trainer}</Typography>
// 			<Box mt={2}>
// 				<Typography>Tags:</Typography>
// 				{training.tags?.map((tag) => (
// 					<Box key={tag} component="span" mr={1}>
// 						#{tag}
// 					</Box>
// 				))}
// 			</Box>

// 			<Divider sx={{ my: 4 }} />

// 			<Typography variant="h5">All Trainings</Typography>
// 			<List>
// 				{trainingList.map((c) => (
// 					<ListItem key={c._id}>
// 						<ListItemText
// 							primary={c.title}
// 							secondary={`${c.date} | ${c.startTime} - ${c.endTime}`}
// 						/>
// 					</ListItem>
// 				))}
// 			</List>
// 		</Container>
// 	);
// };

// export default TrainingDescription;
