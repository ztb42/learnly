import { Avatar } from "@mui/material";

const ColoredAvatar = ({ name }) => {
	// Generate a hash from the name
	const hashCode = (str) =>
		str
			.split("")
			.reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

	// Use the hash to generate a hue (0-360)
	const hue = Math.abs(hashCode(name)) % 360;

	// Generate a pastel color using HSL
	const pastelColor = `hsl(${hue}, 70%, 65%)`;

	// Extract initials from the name
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("");

	return (
		<Avatar
			sx={{
				bgcolor: pastelColor,
				color: "white", // Ensure text is readable
			}}
		>
			{initials}
		</Avatar>
	);
};

export default ColoredAvatar;
