import { Alert, Typography } from "@mui/material";
import { Link } from "react-router";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError();

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<img src="/transparentLogo.png" alt="Error" width={200} />
			<Typography variant="h3" my={4}>
				Oops! Something went wrong.
			</Typography>
			<p>
				We're sorry, but the page you're looking for doesn't exist or an
				error occurred.
			</p>
			<Link to="/">Go back to the homepage</Link>
			{error && (
				<Alert
					severity="error"
					variant="outlined"
					sx={{
						maxWidth: "500px",
						margin: "3rem auto",
					}}
				>
					Error Details:&nbsp;
					<span>{error.statusText || error.message}</span>
				</Alert>
			)}
		</div>
	);
};

export default ErrorPage;
