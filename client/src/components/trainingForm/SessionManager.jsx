import React, { useState } from "react";
import {
	Card,
	CardContent,
	TextField,
	Button,
	IconButton,
	Typography,
	MenuItem,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Progress from "../Progress";

const SessionManager = ({
	sessions,
	loading,
	trainers,
	errors,
	onAddSession,
	onRemoveSession,
	onSessionChange,
}) => {
	const [open, setOpen] = useState(false);
	const [currentSession, setCurrentSession] = useState({
		trainer: "",
		sessionDate: "",
		sessionTime: "",
	});
	const [currentIndex, setCurrentIndex] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});

	// Open the dialog for adding or editing a session
	const handleOpenDialog = (session = null, index = null) => {
		setCurrentSession(
			session
				? {
						...session,
						sessionDate: session.sessionDate
							? dayjs(session.sessionDate).format("YYYY-MM-DD") // Ensure date is in YYYY-MM-DD format
							: "",
						sessionTime: session.sessionTime
							? dayjs(`1970-01-01T${session.sessionTime}`).format(
									"HH:mm"
							  ) // Ensure time is in HH:mm format
							: "",
				  }
				: { trainer: "", sessionDate: "", sessionTime: "" }
		);
		setCurrentIndex(index);
		setValidationErrors({});
		setOpen(true);
	};

	// Close the dialog
	const handleCloseDialog = () => {
		setOpen(false);
		setTimeout(() => {
			setCurrentSession({
				trainer: "",
				sessionDate: "",
				sessionTime: "",
			});
			setCurrentIndex(null);
			setValidationErrors({});
		}, 300);
	};

	// Handle changes in the dialog form
	const handleDialogChange = (name, value) => {
		setCurrentSession((prev) => ({ ...prev, [name]: value }));
		setValidationErrors((prev) => ({ ...prev, [name]: "" }));
	};

	// Validate the session fields
	const validateSession = () => {
		const errors = {};
		if (!currentSession.trainer) {
			errors.trainer = "Trainer is required.";
		}
		if (
			!currentSession.sessionDate ||
			!dayjs(currentSession.sessionDate).isValid()
		) {
			errors.sessionDate = "A valid date is required.";
		}
		if (
			!currentSession.sessionTime ||
			!dayjs(`1970-01-01T${currentSession.sessionTime}`).isValid()
		) {
			errors.sessionTime = "A valid time is required.";
		}
		setValidationErrors(errors);
		return Object.keys(errors).length === 0; // Return true if no errors
	};

	// Save the session (either add or update)
	const handleSaveDialog = () => {
		if (!validateSession()) {
			return;
		}

		const formattedSession = {
			...currentSession,
			sessionDate: dayjs(currentSession.sessionDate).format("YYYY-MM-DD"), // Ensure consistent date format
			sessionTime: dayjs(
				`1970-01-01T${currentSession.sessionTime}`
			).format("HH:mm"), // Ensure consistent time format
		};

		if (currentIndex !== null) {
			// Update existing session
			onSessionChange(currentIndex, "trainer", formattedSession.trainer);
			onSessionChange(
				currentIndex,
				"sessionDate",
				formattedSession.sessionDate
			);
			onSessionChange(
				currentIndex,
				"sessionTime",
				formattedSession.sessionTime
			);
		} else {
			// Add new session
			onAddSession(formattedSession);
		}

		handleCloseDialog();
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Sessions
			</Typography>
			{loading ? (
				<Progress
					sx={{ marginTop: "3rem", mx: "auto", display: "block" }}
				/>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{sessions.length > 0 ? (
						sessions.map((session, index) => {
							const trainer = trainers.find(
								(t) => t._id === session.trainer
							);
							return (
								<Card
									key={index}
									variant="outlined"
									sx={{
										p: 2,
										bgcolor: "#ebf4ff",
										borderColor: "#9db4cf",
									}}
								>
									<CardContent sx={{ display: "flex" }}>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant="subtitle1">
												Trainer:{" "}
												{trainer
													? `${trainer.firstName} ${trainer.lastName}`
													: "Unassigned"}
											</Typography>
											<Box
												sx={{
													display: "flex",
													gap: 1,
													alignItems: "center",
													mt: 1,
												}}
											>
												<CalendarMonthIcon />
												<Typography
													variant="body2"
													mr={2}
												>
													{session.sessionDate
														? dayjs(
																session.sessionDate
														  ).format(
																"MMMM D, YYYY"
														  ) // Display date in readable format
														: "Not set"}
												</Typography>

												<AccessTimeIcon />
												<Typography variant="body2">
													{session.sessionTime
														? dayjs(
																`1970-01-01T${session.sessionTime}`
														  ).format("h:mm A") // Display time in 12-hour format
														: "Not set"}
												</Typography>
											</Box>
										</Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "flex-end",
												alignItems: "center",
											}}
										>
											<IconButton
												color="primary"
												onClick={() =>
													handleOpenDialog(
														session,
														index
													)
												}
											>
												<EditIcon />
											</IconButton>
											<IconButton
												color="error"
												onClick={() =>
													onRemoveSession(index)
												}
											>
												<DeleteIcon />
											</IconButton>
										</Box>
									</CardContent>
								</Card>
							);
						})
					) : (
						<Typography variant="body2" color="text.secondary">
							No sessions added yet.
						</Typography>
					)}
					<Button
						variant="contained"
						color="secondary"
						sx={{ width: "fit-content", mx: "auto", px: 4 }}
						startIcon={<AddIcon />}
						onClick={() => handleOpenDialog()}
					>
						Add Session
					</Button>
					{errors.sessions && (
						<Typography color="error" variant="body2">
							{errors.sessions}
						</Typography>
					)}
				</Box>
			)}

			{/* Dialog for adding/editing a session */}
			<Dialog open={open} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle>
					{currentIndex !== null ? "Edit Session" : "Add Session"}
				</DialogTitle>
				<DialogContent>
					<TextField
						label="Trainer"
						name="trainer"
						select
						value={currentSession.trainer}
						fullWidth
						onChange={(e) =>
							handleDialogChange("trainer", e.target.value)
						}
						error={!!validationErrors.trainer}
						helperText={validationErrors.trainer}
						sx={{ mb: 2, mt: 1 }}
					>
						<MenuItem value="">
							<em>Unassigned</em>
						</MenuItem>
						{trainers.map((t) => (
							<MenuItem key={t._id} value={t._id}>
								{t.firstName} {t.lastName}
							</MenuItem>
						))}
					</TextField>
					<DatePicker
						label="Date"
						value={
							currentSession.sessionDate
								? dayjs(currentSession.sessionDate)
								: null
						}
						onChange={(newValue) =>
							handleDialogChange(
								"sessionDate",
								newValue ? newValue.format("YYYY-MM-DD") : ""
							)
						}
						sx={{ mb: 2 }}
						slotProps={{
							textField: {
								fullWidth: true,
								error: !!validationErrors.sessionDate,
								helperText: validationErrors.sessionDate,
							},
						}}
					/>
					<TimePicker
						label="Time"
						value={
							currentSession.sessionTime
								? dayjs(
										`1970-01-01T${currentSession.sessionTime}`
								  )
								: null
						}
						onChange={(newValue) =>
							handleDialogChange(
								"sessionTime",
								newValue ? newValue.format("HH:mm") : ""
							)
						}
						slotProps={{
							textField: {
								fullWidth: true,
								error: !!validationErrors.sessionTime,
								helperText: validationErrors.sessionTime,
							},
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="error">
						Cancel
					</Button>
					<Button onClick={handleSaveDialog} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default SessionManager;
