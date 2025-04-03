import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import useApi from "../hooks/useApi";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	const { postItem, loading } = useApi("/api/users/reset-password", false);
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			setEmailError("Email is required.");
			return;
		}

		setEmailError("");

		try {
			await postItem({ email });
			enqueueSnackbar(
				"Check your email for instructions to reset your password.",
				{ variant: "success" }
			);
			setEmail(""); // Clear the form
		} catch (error) {
			if (error.response?.status === 404) {
				setEmailError("No account found with that email.");
			} else {
				enqueueSnackbar(
					"Something went wrong. Please try again later.",
					{ variant: "error" }
				);
			}
		}
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
			<Box
				component="div"
				sx={{
					display: "flex",
					justifyContent: "center",
					marginBottom: 2,
				}}
			>
				<img
					src="/transparentLogo.png"
					alt="Logo"
					style={{ width: "150px", height: "auto" }}
				/>
			</Box>

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
						if (e.target.value) setEmailError("");
					}}
					error={!!emailError}
					helperText={emailError}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					sx={{ marginTop: 2, mx: "auto", width: "fit-content" }}
					disabled={loading}
				>
					{loading ? "Sending..." : "Send Email"}
				</Button>
			</Box>
		</Container>
	);
};

export default ForgotPassword;
