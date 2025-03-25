import { styled } from "@mui/system";
import {
	CircularProgress,
	LinearProgress,
	linearProgressClasses,
	circularProgressClasses,
} from "@mui/material";

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

const CustomCircularProgress = styled(CircularProgress)(() => ({
	[`&.${circularProgressClasses.colorPrimary}`]: {
		color: "transparent", // Make the default color transparent
	},
	[`& .${circularProgressClasses.circle}`]: {
		strokeLinecap: "round",
		stroke: "url(#circular-gradient)", // Reference the gradient
	},
}));

const GradientDefs = () => (
	<svg width="0" height="0">
		<defs>
			<linearGradient id="circular-gradient" x1="1" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="rgb(145, 233, 179)" />
				<stop offset="100%" stopColor="#2196f3" />
			</linearGradient>
		</defs>
	</svg>
);

const Progress = ({ type, progress, sx }) => {
	return (
		<>
			{type === "linear" ? (
				<CustomLinearProgress
					variant="determinate"
					value={progress}
					sx={{ ...sx, width: "100%" }}
				/>
			) : (
				<>
					<GradientDefs />
					<CustomCircularProgress
						variant="indeterminate"
						sx={{ ...sx, width: "100%" }}
					/>
				</>
			)}
		</>
	);
};

export default Progress;
