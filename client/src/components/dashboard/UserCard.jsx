import { Box, Button, Card, Typography } from "@mui/material";
import ColoredAvatar from "../ColoredAvatar";

const UserCard = ({ user, sx }) => {
	const name = `${user.firstName} ${user.lastName}`;

	return (
		<Card variant="outlined" sx={{ ...sx, mt: 2, p: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<ColoredAvatar name={name} />
				<Box sx={{ ml: 2, flexGrow: 1 }}>
					<Typography variant="body1">{name}</Typography>
					<Typography variant="body2" color="textSecondary">
						{user.username}
					</Typography>
				</Box>

				<Button variant="outlined" color="primary">
					Edit
				</Button>
			</Box>
		</Card>
	);
};

export default UserCard;
