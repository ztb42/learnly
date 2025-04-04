import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Container,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";

const EditTraining = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: users = [] } = useApi("/api/users");

	const [form, setForm] = useState({
		title: "",
		description: "",
		duration: "",
		deadline: "",
		startTime: "",
		endTime: "",
		manager: "",
		trainer: "",
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		const fetchTraining = async () => {
			try {
				const res = await fetch(`http://localhost:5050/api/training-programs/${id}`);
				const data = await res.json();
				if (res.ok) {
					setForm({
						title: data.title || "",
						description: data.description || "",
						duration: data.duration || "",
						deadline: data.deadline?.split("T")[0] || "",
						startTime: data.startTime || "",
						endTime: data.endTime || "",
						manager: data.manager?._id || "",
						trainer: data.trainer?._id || "",
					});
				} else {
					alert("Training not found");
					navigate("/training-programs");
				}
			} catch (err) {
				console.error("Failed to fetch training:", err);
				navigate("/training-programs");
			}
		};
		fetchTraining();
	}, [id, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};
		Object.keys(form).forEach((key) => {
			if (!form[key]) {
				newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
			}
		});
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const res = await fetch(`http://localhost:5050/api/training-programs/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					duration: parseInt(form.duration),
					manager: form.manager || null,
					trainer: form.trainer || null,
				}),
			});
			if (!res.ok) {
				const data = await res.json();
				alert(data.message || "Failed to update training");
			} else {
				alert("Training updated!");
				navigate("/training-programs");
			}
		} catch (err) {
			console.error("🔥 Error updating training:", err);
			alert("Server error: " + err.message);
		}
	};

	const managers = users.filter((u) => u.role?.roleName === "Manager");
	const trainers = users.filter((u) => u.role?.roleName === "Trainer");

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4" mb={3}>
				Edit Training
			</Typography>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ display: "flex", flexDirection: "column", gap: 3 }}
			>
				<TextField
					label="Title"
					name="title"
					fullWidth
					value={form.title}
					onChange={handleChange}
					error={!!errors.title}
					helperText={errors.title}
				/>
				<TextField
					label="Description"
					name="description"
					fullWidth
					multiline
					rows={4}
					value={form.description}
					onChange={handleChange}
					error={!!errors.description}
					helperText={errors.description}
				/>
				<TextField
					label="Duration (weeks)"
					type="number"
					name="duration"
					fullWidth
					value={form.duration}
					onChange={handleChange}
					error={!!errors.duration}
					helperText={errors.duration}
				/>
				<TextField
					label="Deadline"
					type="date"
					name="deadline"
					fullWidth
					InputLabelProps={{ shrink: true }}
					value={form.deadline}
					onChange={handleChange}
					error={!!errors.deadline}
					helperText={errors.deadline}
				/>
				<TextField
					label="Start Time"
					type="time"
					name="startTime"
					fullWidth
					InputLabelProps={{ shrink: true }}
					value={form.startTime}
					onChange={handleChange}
				/>
				<TextField
					label="End Time"
					type="time"
					name="endTime"
					fullWidth
					InputLabelProps={{ shrink: true }}
					value={form.endTime}
					onChange={handleChange}
				/>
				<FormControl fullWidth>
					<InputLabel id="manager-label">Assign Manager</InputLabel>
					<Select
						labelId="manager-label"
						name="manager"
						value={form.manager}
						onChange={handleChange}
					>
						<MenuItem value="">
							<em>Unassigned</em>
						</MenuItem>
						{managers.map((m) => (
							<MenuItem key={m._id} value={m._id}>
								{m.firstName} {m.lastName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel id="trainer-label">Assign Trainer</InputLabel>
					<Select
						labelId="trainer-label"
						name="trainer"
						value={form.trainer}
						onChange={handleChange}
					>
						<MenuItem value="">
							<em>Unassigned</em>
						</MenuItem>
						{trainers.map((t) => (
							<MenuItem key={t._id} value={t._id}>
								{t.firstName} {t.lastName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button type="submit" variant="contained" color="primary">
					Update Training
				</Button>
			</Box>
		</Container>
	);
};

export default EditTraining;

