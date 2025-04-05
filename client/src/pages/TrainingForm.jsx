import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useSnackbar } from "notistack";
import TrainingFormFields from "../components/trainingForm/TrainingFormFields";
import SessionManager from "../components/trainingForm/SessionManager";
import Progress from "../components/Progress";

const TrainingForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { data: users = [] } = useApi("/api/users");
	const {
		data: training,
		postItem: createTraining,
		editItem: updateTraining,
		loading: trainingLoading,
	} = useApi(`/api/training-programs${id ? "/" + id : ""}`, !!id);
	const { data: sessions, loading: sessionsLoading } = useApi(
		`/api/training-sessions/program/${id}`,
		!!id
	);
	const { enqueueSnackbar } = useSnackbar();

	const [form, setForm] = useState({
		title: "",
		description: "",
		duration: "",
		deadline: "",
		manager: "",
		sessions: [],
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (id) {
			setForm({
				title: training.title || "",
				description: training.description || "",
				duration: training.duration?.toString() || "",
				deadline: training.deadline
					? new Date(training.deadline).toISOString().split("T")[0]
					: "",
				manager: training.manager?._id || "",
				sessions:
					sessions.map((session) => ({
						...session,
						trainer: session.trainer?._id || "", // Ensure trainer ID is set
					})) || [],
			});
		}
	}, [id, training, sessions]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const handleSessionChange = (index, field, value) => {
		const updatedSessions = [...form.sessions];
		updatedSessions[index][field] = value;
		setForm((prevForm) => ({ ...prevForm, sessions: updatedSessions }));
	};

	const handleAddSession = (newSession) => {
		setForm((prevForm) => ({
			...prevForm,
			sessions: [...prevForm.sessions, newSession],
		}));
	};

	const handleRemoveSession = (index) => {
		const updatedSessions = form.sessions.filter((_, i) => i !== index);
		setForm((prevForm) => ({ ...prevForm, sessions: updatedSessions }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};
		Object.keys(form).forEach((key) => {
			if (!form[key] && key !== "sessions") {
				newErrors[key] = `${
					key.charAt(0).toUpperCase() + key.slice(1)
				} is required.`;
			}
		});

		if (
			form.sessions.some(
				(session) =>
					!session.trainer ||
					!session.sessionDate ||
					!session.sessionTime
			)
		) {
			newErrors.sessions =
				"All sessions must have a trainer, date, and time.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			if (id) {
				await updateTraining({
					...form,
					duration: parseInt(form.duration),
					manager: form.manager || null,
				});
				enqueueSnackbar("Training updated successfully", {
					variant: "success",
				});
			} else {
				await createTraining({
					...form,
					duration: parseInt(form.duration),
					manager: form.manager || null,
				});
				enqueueSnackbar("Training created successfully", {
					variant: "success",
				});
			}
			navigate("/training-programs");
		} catch (err) {
			enqueueSnackbar(err?.message || "Failed to save training", {
				variant: "error",
			});
		}
	};

	const managers = users.filter((u) => u.role?.roleName === "Manager");
	const trainers = users.filter((u) => u.role?.roleName === "Trainer");

	return (
		<Container maxWidth="sm" sx={{ padding: 2, marginTop: "3rem" }}>
			<Typography variant="h4" mb={3} textAlign="center">
				{id ? "Edit Training" : "Create Training"}
			</Typography>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ display: "flex", flexDirection: "column", gap: 3 }}
			>
				{trainingLoading ? (
					<Progress sx={{ marginTop: "3rem", mx: "auto" }} />
				) : (
					<>
						<TrainingFormFields
							form={form}
							errors={errors}
							managers={managers}
							onChange={handleChange}
						/>
						<SessionManager
							sessions={form.sessions}
							loading={sessionsLoading}
							trainers={trainers}
							errors={errors}
							onAddSession={handleAddSession}
							onRemoveSession={handleRemoveSession}
							onSessionChange={handleSessionChange}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{
								mx: "auto",
								width: "fit-content",
								px: 4,
							}}
						>
							{id ? "Update" : "Submit"}
						</Button>
					</>
				)}
			</Box>
		</Container>
	);
};

export default TrainingForm;
