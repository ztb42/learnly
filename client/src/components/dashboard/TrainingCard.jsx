import {
	Card,
	CardContent,
	Typography,
	Divider,
	Box,
	Chip,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime";
import useAuth from "../../hooks/useAuth";

const TrainingCard = ({ training }) => {
	const { user } = useAuth();
	const currentUserRole = user?.role?.roleName || "";

	const managerName = training.manager
		? `${training.manager.firstName} ${training.manager.lastName}`
		: "Unassigned";

	return (
		<Card variant="outlined" sx={{ mt: 2 }}>
			<CardContent>
				<Typography variant="h6">{training.title}</Typography>
				<Typography variant="body2" sx={{ color: "darkgray" }}>
					{training.description}
				</Typography>

				{["Admin", "Trainer"].includes(currentUserRole) && (
					<Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
						Manager: {managerName}
					</Typography>
				)}

				<Divider sx={{ my: 2, opacity: 1 }} />

				<Box sx={{ display: "flex", alignItems: "center" }}>
					<ClockIcon color="primary" />
					<Typography
						variant="body2"
						sx={{
							color: "darkgray",
							flex: 1,
							marginLeft: "1rem",
						}}
					>
						Duration: {training.duration} weeks
					</Typography>
					<Chip label="Enrolled" color="primary" />
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrainingCard;
