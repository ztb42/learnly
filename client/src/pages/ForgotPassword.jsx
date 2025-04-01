import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Divider,
	Container,
} from "@mui/material";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!email) {
			setEmailError("Email is required.");
			return;
		}

		setEmailError(""); // Clear error if validation passes
		console.log("Password reset requested for:", email);
	};

	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
				padding: 2,
				marginTop: "3rem",
			}}
		>
			<Typography variant="h4" component="h1" gutterBottom>
				Forgot Password?
			</Typography>

			<Typography
				variant="body1"
				sx={{ textAlign: "center", marginBottom: 2 }}
			>
				Enter your email address below, and if an account exists, we’ll
				send you an email with instructions to reset your password.
			</Typography>

			<Typography
				variant="body2"
				component="span"
				sx={{ fontStyle: "italic", color: "gray" }}
			>
				Don’t forget to check your spam folder!
			</Typography>

			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					width: "100%",
					marginTop: 3,
				}}
			>
				<TextField
					type="email"
					label="Enter Email Address"
					variant="outlined"
					fullWidth
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						if (e.target.value) setEmailError(""); // Clear error on input
					}}
					error={!!emailError}
					helperText={emailError}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					sx={{ marginTop: 2, mx: "auto", width: "fit-content" }}
				>
					Send Email
				</Button>
			</Box>
		</Container>
	);
};

export default ForgotPassword;
