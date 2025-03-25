import React from "react";
import { Avatar } from "@mui/material";

const ColoredAvatar = ({ name }) => {
	// Generate a random background color
	const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

	// Extract initials from the name
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("");

	return (
		<Avatar
			sx={{
				bgcolor: randomColor,
			}}
		>
			{initials}
		</Avatar>
	);
};

export default ColoredAvatar;
