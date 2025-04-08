import {
	Card,
	CardContent,
	Typography,
	Divider,
	Box,
	Button,
	IconButton,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TrainingCard = ({ training, handleDelete }) => {
	const { user } = useAuth();
	const currentUserRole = user?.role?.roleName || "";

	const navigate = useNavigate();

	const managerName = training.manager
		? `${training.manager.firstName} ${training.manager.lastName}`
		: "Unassigned";

	const handleCardClick = () => {
		navigate(`/training-programs/${training._id}`);
	};

	return (
		<Card
			variant="outlined"
			sx={{
				mt: 2,
				cursor: "pointer",
				"&:hover": { boxShadow: 3 },
			}}
			onClick={handleCardClick}
		>
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

					{currentUserRole === "Admin" && (
						<Box>
							<IconButton
								component={Link}
								to={`/training-programs/${training._id}/edit`}
								color="primary"
								onClick={(e) => e.stopPropagation()}
							>
								<EditIcon />
							</IconButton>
							<IconButton
								color="error"
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(training);
								}}
								sx={{
									display: handleDelete
										? "inline-flex"
										: "none",
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrainingCard;
