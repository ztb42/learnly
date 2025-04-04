import {
	Card,
	CardContent,
	Typography,
	Divider,
	Box,
	Chip,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime";

const TrainingCard = ({ training }) => {
	const trainerName = training.trainer
		? `${training.trainer.firstName} ${training.trainer.lastName}`
		: "Unassigned";

	return (
		<Card variant="outlined" sx={{ mt: 2 }}>
			<CardContent>
				<Typography variant="h6">{training.title}</Typography>
				<Typography variant="body2" sx={{ color: "darkgray" }}>
					{training.description}
				</Typography>

				<Typography
					variant="body2"
					sx={{ color: "gray", mt: 1 }}
				>
					Trainer: {trainerName}
				</Typography>

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
