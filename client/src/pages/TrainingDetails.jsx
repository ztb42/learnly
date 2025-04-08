import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Container,
	Typography,
	Box,
	Card,
	CardContent,
	Button,
	Grid2,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Divider,
} from "@mui/material";
import ColoredAvatar from "../components/ColoredAvatar";
import useApi from "../hooks/useApi";
import { useSnackbar } from "notistack";
import Progress from "../components/Progress";
import useAuth from "../hooks/useAuth";
import dayjs from "dayjs";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const TrainingDetails = () => {
	const { id } = useParams();
	const { user: currentUser } = useAuth();
	const currentRole = currentUser?.role?.roleName;

	const { enqueueSnackbar } = useSnackbar();

	const { data: training, loading: trainingLoading } = useApi(
		`/api/training-programs/${id}`
	);
	const { data: sessions } = useApi(`/api/training-sessions/program/${id}`);
	const { data: users, loading: usersLoading } = useApi("/api/users");
	const { data: roles } = useApi("/api/roles");
	const { data: assignedEmployees, refetch: refetchAssignedEmployees } =
		useApi(`/api/assignments/training/${id}/employees`);
	const { data: assignments, refetch: refetchAssignments } = useApi(
		`/api/assignments/training/${id}`
	);
	const { postItem: createAssignment } = useApi("/api/assignments", false);
	const { data: enrollments, postItem: createEnrollment } = useApi(
		"/api/enrollments",
		currentRole === "Employee"
	);
	const { editItem: markComplete } = useApi(
		`/api/assignments/mark-complete`,
		false
	);

	const [openDialog, setOpenDialog] = useState(false);

	const employeeRole = roles.find(
		(role) => role.roleName.toLowerCase() === "employee"
	);
	const allEmployees = users.filter(
		(user) =>
			user.role._id === employeeRole?._id &&
			!assignedEmployees.some((assigned) => assigned._id === user._id)
	);

	const assignmentIdMap = assignments.reduce((map, assignment) => {
		map[assignment.employee._id] = assignment._id;
		return map;
	}, {});

	const isUserEnrolled = (sessionId) => {
		const assignmentId = assignmentIdMap[currentUser._id];
		return enrollments.some(
			(enrollment) =>
				enrollment.session === sessionId &&
				enrollment.assignment === assignmentId
		);
	};

	const handleAssignEmployee = async (employeeId) => {
		try {
			await createAssignment({
				employee: employeeId,
				training: id,
				assignedByManager: currentUser._id,
			});
			enqueueSnackbar("Employee assigned successfully!", {
				variant: "success",
			});
			refetchAssignedEmployees();
			refetchAssignments();
			setOpenDialog(false);
		} catch (err) {
			enqueueSnackbar(err.message || "Failed to assign employee", {
				variant: "error",
			});
		}
	};

	const handleEnroll = async (sessionId) => {
		try {
			const assignmentId = assignmentIdMap[currentUser._id];
			if (!assignmentId) {
				enqueueSnackbar(
					"You must be assigned to this training before enrolling.",
					{
						variant: "warning",
					}
				);
				return;
			}

			await createEnrollment({
				session: sessionId,
				assignment: assignmentId,
			});
			enqueueSnackbar("Successfully enrolled in the session!", {
				variant: "success",
			});
		} catch (err) {
			enqueueSnackbar(err.message || "Failed to enroll", {
				variant: "error",
			});
		}
	};

	const handleMarkComplete = async (employee) => {
		try {
			await markComplete({
				assignmentId: assignmentIdMap[employee._id],
				employeeId: employee._id,
			});
			enqueueSnackbar("Marked as complete.", {
				variant: "success",
			});
			refetchAssignedEmployees();
		} catch (err) {
			enqueueSnackbar(err.message || "Failed to mark as complete", {
				variant: "error",
			});
		}
	};

	if (trainingLoading || usersLoading)
		return <Progress sx={{ mt: 8, mx: "auto", display: "block" }} />;

	return (
		<Container
			maxWidth="lg"
			sx={{
				py: 6,
				px: "4rem !important",
				bgcolor: "#d9dce7",
				minHeight: "calc(100vh - 65px)",
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mt={2}
			>
				<Typography variant="h4">{training.title}</Typography>
				{currentRole === "Admin" && (
					<Button
						component={Link}
						to={`/training-programs/${id}/edit`}
						variant="contained"
					>
						Edit
					</Button>
				)}

				{currentRole === "Manager" && (
					<Button
						variant="contained"
						onClick={() => setOpenDialog(true)}
					>
						Assign Employees
					</Button>
				)}
			</Box>

			<Box
				mt={6}
				display="flex"
				flexDirection="row"
				gap={8}
				justifyContent="center"
			>
				<Box display="flex" flexDirection="column" mb={2}>
					<Typography variant="body1">Enrolled:</Typography>
					<Typography variant="body1" color="textSecondary">
						{assignedEmployees.length}
					</Typography>
				</Box>
				<Box display="flex" flexDirection="column" mb={2}>
					<Typography variant="body1">Sessions:</Typography>
					<Typography variant="body1" color="textSecondary">
						{sessions.length}
					</Typography>
				</Box>
				<Box display="flex" flexDirection="column" mb={2}>
					<Typography variant="body1">Duration:</Typography>
					<Typography variant="body1" color="textSecondary">
						{training.duration} weeks
					</Typography>
				</Box>
			</Box>

			<Typography variant="h6" mt={4} mb={1}>
				Training Description
			</Typography>
			<Typography variant="body1" color="textSecondary" mb={4}>
				{training.description}
			</Typography>

			<Typography variant="h6" mt={4} mb={1}>
				Sessions
			</Typography>
			<Grid2 container spacing={2} mb={4}>
				{(sessions || []).map((session) => (
					<Grid2 key={session._id} size={{ xs: 12, sm: 6, md: 4 }}>
						<Card
							variant="outlined"
							sx={{ borderColor: "#a9abb3" }}
						>
							<CardContent>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="space-evenly"
									gap={1}
									mt={1}
								>
									<Box
										display="flex"
										flexDirection="column"
										alignItems="center"
									>
										<CalendarMonthIcon
											sx={{
												fontSize: "2.5rem",
												color: "#999",
												mb: 1,
											}}
										/>
										<Typography>
											{dayjs(session.sessionDate).format(
												"MM/DD/YYYY"
											)}{" "}
											{/* Format date */}
										</Typography>
									</Box>

									<Box
										display="flex"
										flexDirection="column"
										alignItems="center"
									>
										<AccessTimeFilledIcon
											sx={{
												fontSize: "2.5rem",
												color: "#999",
												mb: 1,
											}}
										/>
										<Typography>
											{dayjs(
												session.sessionTime,
												"HH:mm"
											).format("h:mm A")}{" "}
											{/* Format time */}
										</Typography>
									</Box>
								</Box>

								<Divider sx={{ my: 2, opacity: 1 }} />

								<Typography>
									Trainer:{" "}
									{session.trainer
										? `${session.trainer.firstName} ${session.trainer.lastName}`
										: "Unassigned"}
								</Typography>

								{currentRole === "Employee" && (
									<Box
										display="flex"
										justifyContent="center"
										mt={2}
									>
										<Button
											variant="contained"
											onClick={() =>
												handleEnroll(session._id)
											}
											disabled={isUserEnrolled(
												session._id
											)}
											sx={{
												px: 4,
											}}
										>
											{isUserEnrolled(session._id)
												? "Already Enrolled"
												: "Enroll"}
										</Button>
									</Box>
								)}
							</CardContent>
						</Card>
					</Grid2>
				))}
			</Grid2>

			{currentRole !== "Employee" && (
				<>
					<Typography variant="h6" mb={2}>
						Assigned Employees
					</Typography>
					{assignedEmployees.length === 0 ? (
						<Typography variant="body2" color="textSecondary">
							No employees assigned to this training.
						</Typography>
					) : (
						assignedEmployees.map((employee) => (
							<Card
								variant="outlined"
								sx={{ mt: 2, p: 2 }}
								key={employee._id}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<ColoredAvatar
											name={`${employee.firstName} ${employee.lastName}`}
										/>
										<Box sx={{ ml: 2 }}>
											<Typography variant="body1">
												{`${employee.firstName} ${employee.lastName}`}
											</Typography>
											<Typography
												variant="body2"
												color="textSecondary"
											>
												{employee.username}
											</Typography>
										</Box>
									</Box>
									{currentRole === "Admin" && (
										<Button
											color="success"
											variant="outlined"
											onClick={() =>
												handleMarkComplete(employee)
											}
										>
											Mark as completed
										</Button>
									)}
								</Box>
							</Card>
						))
					)}
				</>
			)}

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Assign Employee to Training</DialogTitle>
				<DialogContent>
					<List>
						{allEmployees.map((emp) => (
							<ListItemButton
								key={emp._id}
								onClick={() => handleAssignEmployee(emp._id)}
							>
								<ListItemText
									primary={`${emp.firstName} ${emp.lastName}`}
								/>
							</ListItemButton>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default TrainingDetails;
