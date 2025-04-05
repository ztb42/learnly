import {
	Avatar,
	AvatarGroup,
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
} from "@mui/material";
import ColoredAvatar from "../ColoredAvatar";
import Progress from "../Progress";

const CategoryCard = ({ category, users }) => {
	return (
		<>
			<Card
				elevation={4}
				sx={{ borderRadius: "12px", position: "relative" }}
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
						{category.trainings === 1
							? `${category.trainings} training`
							: `${category.trainings} trainings`}
					</Typography>

					<AvatarGroup max={3}>
						{users?.map((user) => {
							const name = `${user.firstName} ${user.lastName}`;
							return <ColoredAvatar key={user._id} name={name} />;
						})}
					</AvatarGroup>
				</CardContent>
			</Card>
		</>
	);
};

export default CategoryCard;
