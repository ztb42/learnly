import { useState } from "react";
import {
	Avatar,
	AvatarGroup,
	Box,
	Card,
	CardContent,
	CardMedia,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ColoredAvatar from "../ColoredAvatar";
import Progress from "../Progress";
import TrainingCard from "./TrainingCard"; // Ensure the correct path to TrainingCard

const CategoryCard = ({ category, users }) => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Card
				elevation={4}
				sx={{
					borderRadius: "12px",
					position: "relative",
					cursor: "pointer",
				}}
				onClick={handleOpen}
			>
				<Box sx={{ position: "relative" }}>
					<CardMedia
						component="img"
						height="140"
						image={category.image}
						alt={category.name}
					/>
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.6)", // Black overlay with 50% opacity
						}}
					/>
					<Box
						sx={{
							position: "absolute",
							bottom: "20px",
							left: "20px",
						}}
					>
						<Typography
							variant="h6"
							sx={{
								color: "white",
							}}
						>
							{category.name}
						</Typography>
					</Box>
				</Box>

				<CardContent sx={{ display: "flex", alignItems: "center" }}>
					<Typography
						variant="body1"
						sx={{
							flex: 1,
							mr: 3,
						}}
					>
						{category.trainings.length === 1
							? `${category.trainings.length} training`
							: `${category.trainings.length} trainings`}
					</Typography>

					<AvatarGroup max={3}>
						{users?.map((user) => {
							const name = `${user.firstName} ${user.lastName}`;
							return <ColoredAvatar key={user._id} name={name} />;
						})}
					</AvatarGroup>
				</CardContent>
			</Card>

			{/* Dialog */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
				<DialogTitle>
					{category.name} Trainings
					<IconButton
						aria-label="close"
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent
					dividers
					sx={{
						bgcolor: "#e5e7f1",
						pb: 5,
					}}
				>
					{category.trainings.length > 0 ? (
						category.trainings.map((training) => (
							<TrainingCard
								key={training._id}
								training={training}
							/>
						))
					) : (
						<Typography variant="body1" color="textSecondary">
							No trainings available in this category.
						</Typography>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CategoryCard;
