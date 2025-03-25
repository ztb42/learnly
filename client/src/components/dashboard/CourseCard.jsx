import {
	Card,
	CardContent,
	Typography,
	Divider,
	Box,
	Chip,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime";

const CourseCard = ({ course }) => {
	return (
		<Card variant="outlined" sx={{ mt: 2 }}>
			<CardContent>
				<Typography variant="h6">{course.title}</Typography>
				<Typography variant="body2" sx={{ color: "darkgray" }}>
					{course.description}
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
						Duration: {course.duration} weeks
					</Typography>
					<Chip label="Enrolled" color="primary" />
				</Box>
			</CardContent>
		</Card>
	);
};

export default CourseCard;
