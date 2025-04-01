import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Divider,
	Container,
} from "@mui/material";
import { Link } from "react-router";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		let hasError = false;

		if (!username) {
			setUsernameError("Username is required.");
			hasError = true;
		} else {
			setUsernameError("");
		}

		if (!password) {
			setPasswordError("Password is required.");
			hasError = true;
		} else {
			setPasswordError("");
		}

		if (hasError) return;

		console.log("Logging in with:", username, password);
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
				Learnly Training App
			</Typography>

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
					style={{ width: "180px", height: "auto" }}
				/>
			</Box>

			<Typography variant="h5" component="p">
				Login
			</Typography>
			<Divider sx={{ width: "100%", my: 5, opacity: 1 }} />

			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					width: "100%",
				}}
			>
				<TextField
					label="Username"
					variant="outlined"
					fullWidth
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
						if (e.target.value) setUsernameError("");
					}}
					error={!!usernameError}
					helperText={usernameError}
				/>

				<TextField
					label="Password"
					type="password"
					variant="outlined"
					fullWidth
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						if (e.target.value) setPasswordError("");
					}}
					error={!!passwordError}
					helperText={passwordError}
				/>

				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<Link to="/forgot-password" variant="body2">
						Forgot Password?
					</Link>
				</Box>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					sx={{
						marginTop: 2,
						mx: "auto",
						width: "fit-content",
						px: 4,
					}}
				>
					Login
				</Button>
			</Box>
		</Container>
	);
};

export default Login;
