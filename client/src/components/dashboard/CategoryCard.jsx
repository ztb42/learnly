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

const dummyUsers = [
	{ id: 1, name: "Jon Snow" },
	{ id: 2, name: "Daenerys Targaryen" },
	{ id: 3, name: "Arya Stark" },
	{ id: 4, name: "Tyrion Lannister" },
	{ id: 5, name: "Cersei Lannister" },
	{ id: 6, name: "Sansa Stark" },
	{ id: 7, name: "Jaime Lannister" },
	{ id: 8, name: "Bran Stark" },
	{ id: 9, name: "Brienne of Tarth" },
	{ id: 10, name: "Sandor Clegane" },
];

const CategoryCard = ({ category }) => {
	return (
		<Card elevation={4} sx={{ borderRadius: "12px", position: "relative" }}>
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
					<Typography
						variant="body2"
						sx={{
							color: "darkgray",
						}}
					>
						{category.projects} Projects
					</Typography>
				</Box>
			</Box>

			<CardContent sx={{ display: "flex", alignItems: "center" }}>
				<div
					style={{
						flex: 1,
						marginRight: "2rem",
					}}
				>
					<Typography variant="body1" gutterBottom fontWeight={600}>
						{category.progress}%
					</Typography>
					<Progress type="linear" progress={category.progress} />
				</div>

				<AvatarGroup max={3}>
					{dummyUsers.map((user) => (
						<ColoredAvatar key={user.id} name={user.name} />
					))}
				</AvatarGroup>
			</CardContent>
		</Card>
	);
};

export default CategoryCard;
