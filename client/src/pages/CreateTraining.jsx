import {
	Box,
	Button,
	Container,
	MenuItem,
	Select,
	TextField,
	Typography,
	Chip,
	InputLabel,
	FormControl,
} from "@mui/material";
import { useState } from "react";

const courseOptions = ["Website", "Cyber Security", "Marketing"];
const tagOptions = [
	{ label: "UI Design", color: "primary" },
	{ label: "Website", color: "secondary" },
	{ label: "Designer", color: "success" },
	{ label: "Marketing", color: "warning" },
	{ label: "Social Media", color: "info" },
];

const mockManagers = ["Alice", "Diana"];
const mockTrainers = ["Bob", "Ethan"];

const CreateTraining = () => {
	const [formData, setFormData] = useState({
		title: "",
		date: "",
		startTime: "",
		endTime: "",
		description: "",
		course: "",
		tags: [],
		manager: "",
		trainer: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleTagClick = (tag) => {
		setFormData((prev) => {
			const tags = prev.tags.includes(tag)
				? prev.tags.filter((t) => t !== tag)
				: [...prev.tags, tag];
			return { ...prev, tags };
		});
	};

	const handleSubmit = async () => {
		try {
			const res = await fetch("http://localhost:5000/trainings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const result = await res.json();
			console.log("Success:", result);
			alert("Training created!");
		} catch (err) {
			console.error("Error:", err);
			alert("Something went wrong.");
		}
	};

	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
				padding: 2,
				marginTop: "3rem",
			}}
		>
			<Typography variant="h4" gutterBottom>
				Create Training
			</Typography>

			<TextField
				fullWidth
				label="Title"
				name="title"
				value={formData.title}
				onChange={handleChange}
				margin="normal"
			/>
			<TextField
				fullWidth
				type="date"
				name="date"
				value={formData.date}
				onChange={handleChange}
				margin="normal"
			/>
			<TextField
				fullWidth
				type="time"
				name="startTime"
				value={formData.startTime}
				onChange={handleChange}
				margin="normal"
				label="Start Time"
			/>
			<TextField
				fullWidth
				type="time"
				name="endTime"
				value={formData.endTime}
				onChange={handleChange}
				margin="normal"
				label="End Time"
			/>
			<TextField
				fullWidth
				label="Description"
				name="description"
				value={formData.description}
				onChange={handleChange}
				multiline
				rows={4}
				margin="normal"
			/>

			<FormControl fullWidth margin="normal">
				<InputLabel>Course</InputLabel>
				<Select
					name="course"
					value={formData.course}
					onChange={handleChange}
				>
					{courseOptions.map((course) => (
						<MenuItem key={course} value={course}>
							{course}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Box mt={2}>
				<Typography variant="subtitle1" gutterBottom>
					Tags:
				</Typography>
				{tagOptions.map((tag) => (
					<Chip
						key={tag.label}
						label={tag.label}
						color={tag.color}
						variant={
							formData.tags.includes(tag.label)
								? "filled"
								: "outlined"
						}
						onClick={() => handleTagClick(tag.label)}
						sx={{ mr: 1, mb: 1 }}
					/>
				))}
			</Box>

			<FormControl fullWidth margin="normal">
				<InputLabel>Assign Manager</InputLabel>
				<Select
					name="manager"
					value={formData.manager}
					onChange={handleChange}
				>
					{mockManagers.map((m) => (
						<MenuItem key={m} value={m}>
							{m}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth margin="normal">
				<InputLabel>Assign Trainer</InputLabel>
				<Select
					name="trainer"
					value={formData.trainer}
					onChange={handleChange}
				>
					{mockTrainers.map((t) => (
						<MenuItem key={t} value={t}>
							{t}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Button
				variant="contained"
				fullWidth
				sx={{ mt: 3 }}
				onClick={handleSubmit}
			>
				Create Course
			</Button>
		</Container>
	);
};

export default CreateTraining;
