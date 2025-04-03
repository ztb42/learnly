import React, { useState } from "react";
import axios from "axios";
import {
	Box,
	Button,
	TextField,
	Typography,
	Container,
	Snackbar,
	Alert,
} from "@mui/material";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			setEmailError("Email is required.");
			return;
		}

		setEmailError("");

		try {
			const res = await axios.post(`${BASE_URL}/api/users/reset-password`, { email });
			setSnackbar({
				open: true,
				message: res.data.message || "Check your email for the temporary password.",
				severity: "success",
			});
			setEmail(""); // Clear the form
		} catch (error) {
			console.error("Reset password error:", error);
			if (error.response?.status === 404) {
				setEmailError("No account found with that email.");
			} else {
				setSnackbar({
					open: true,
					message: "Something went wrong. Please try again later.",
					severity: "error",
				});
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
			<Typography variant="h4" component="h1" gutterBottom>
				Forgot Password?
			</Typography>

			<Typography variant="body1" sx={{ textAlign: "center", marginBottom: 2 }}>
				Enter your email address below, and if an account exists, we’ll send you an email with instructions to reset your password.
			</Typography>

			<Typography variant="body2" component="span" sx={{ fontStyle: "italic", color: "gray" }}>
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
				>
					Send Email
				</Button>
			</Box>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert severity={snackbar.severity} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default ForgotPassword;


// import React, { useState } from "react";
// import {
// 	Box,
// 	Button,
// 	TextField,
// 	Typography,
// 	Divider,
// 	Container,
// } from "@mui/material";

// const ForgotPassword = () => {
// 	const [email, setEmail] = useState("");
// 	const [emailError, setEmailError] = useState("");

// 	const handleSubmit = (e) => {
// 		e.preventDefault();

// 		if (!email) {
// 			setEmailError("Email is required.");
// 			return;
// 		}

// 		setEmailError(""); // Clear error if validation passes
// 		console.log("Password reset requested for:", email);
// 	};

// 	return (
// 		<Container
// 			maxWidth="sm"
// 			sx={{
// 				display: "flex",
// 				flexDirection: "column",
// 				alignItems: "center",
// 				textAlign: "center",
// 				padding: 2,
// 				marginTop: "3rem",
// 			}}
// 		>
// 			<Typography variant="h4" component="h1" gutterBottom>
// 				Forgot Password?
// 			</Typography>

// 			<Typography
// 				variant="body1"
// 				sx={{ textAlign: "center", marginBottom: 2 }}
// 			>
// 				Enter your email address below, and if an account exists, we’ll
// 				send you an email with instructions to reset your password.
// 			</Typography>

// 			<Typography
// 				variant="body2"
// 				component="span"
// 				sx={{ fontStyle: "italic", color: "gray" }}
// 			>
// 				Don’t forget to check your spam folder!
// 			</Typography>

// 			<Box
// 				component="form"
// 				onSubmit={handleSubmit}
// 				sx={{
// 					display: "flex",
// 					flexDirection: "column",
// 					gap: 2,
// 					width: "100%",
// 					marginTop: 3,
// 				}}
// 			>
// 				<TextField
// 					type="email"
// 					label="Enter Email Address"
// 					variant="outlined"
// 					fullWidth
// 					value={email}
// 					onChange={(e) => {
// 						setEmail(e.target.value);
// 						if (e.target.value) setEmailError(""); // Clear error on input
// 					}}
// 					error={!!emailError}
// 					helperText={emailError}
// 				/>

// 				<Button
// 					type="submit"
// 					variant="contained"
// 					color="primary"
// 					sx={{ marginTop: 2, mx: "auto", width: "fit-content" }}
// 				>
// 					Send Email
// 				</Button>
// 			</Box>
// 		</Container>
// 	);
// };

// export default ForgotPassword;
