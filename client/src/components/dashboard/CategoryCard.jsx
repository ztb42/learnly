import {
	Avatar,
	AvatarGroup,
	Box,
	Card,
	CardContent,
	CardMedia,
	Grid2,
	LinearProgress,
	linearProgressClasses,
	styled,
	Typography,
} from "@mui/material";
import ColoredAvatar from "../ColoredAvatar";

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

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 6,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[200],
		...theme.applyStyles("dark", {
			backgroundColor: theme.palette.grey[800],
		}),
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		background: "linear-gradient(to right,rgb(145, 233, 179), #2196f3)",
		...theme.applyStyles("dark", {
			background: "linear-gradient(to right,rgb(145, 233, 179), #2196f3)",
		}),
	},
}));

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
					<CustomLinearProgress
						variant="determinate"
						value={category.progress}
					/>
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
