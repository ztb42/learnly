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

// const CourseDescription = () => {
// 	const { id } = useParams();
// 	const [course, setCourse] = useState(null);
// 	const [courseList, setCourseList] = useState([]);

// 	useEffect(() => {
// 		// Obtener el curso actual
// 		fetch(`http://localhost:5000/trainings/${id}`)
// 			.then((res) => res.json())
// 			.then(setCourse);

// 		// Obtener todos los cursos
// 		fetch("http://localhost:5000/trainings")
// 			.then((res) => res.json())
// 			.then(setCourseList);
// 	}, [id]);

// 	if (!course) return <Typography>Loading...</Typography>;

// 	return (
// 		<Container maxWidth="md">
// 			<Typography variant="h4" gutterBottom>
// 				{course.title}
// 			</Typography>
// 			<Typography>Date: {course.date}</Typography>
// 			<Typography>
// 				Time: {course.startTime} - {course.endTime}
// 			</Typography>
// 			<Typography>Description: {course.description}</Typography>
// 			<Typography>Course: {course.course}</Typography>
// 			<Typography>Manager: {course.manager}</Typography>
// 			<Typography>Trainer: {course.trainer}</Typography>
// 			<Box mt={2}>
// 				<Typography>Tags:</Typography>
// 				{course.tags?.map((tag) => (
// 					<Box key={tag} component="span" mr={1}>
// 						#{tag}
// 					</Box>
// 				))}
// 			</Box>

// 			<Divider sx={{ my: 4 }} />

// 			<Typography variant="h5">All Courses</Typography>
// 			<List>
// 				{courseList.map((c) => (
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

// export default CourseDescription;
