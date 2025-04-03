import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	Box,
	TextField,
	Button,
	Typography,
	CircularProgress,
	Container,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useApi from "../hooks/useApi";
import Progress from "../components/Progress";

const PasswordReset = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const { postItem, loading } = useApi("/api/users/reset-password/confirm");

	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			enqueueSnackbar("Passwords do not match.", { variant: "error" });
			return;
		}

		try {
			await postItem({ token, newPassword });
			enqueueSnackbar(
				"Password reset successfully. Redirecting to login...",
				{ variant: "success" }
			);
			setTimeout(() => navigate("/login"), 2000); // Redirect to login after 3 seconds
		} catch (err) {
			enqueueSnackbar(err || "Something went wrong.", {
				variant: "error",
			});
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
				Reset Your Password
			</Typography>

			<Typography
				variant="body1"
				sx={{ textAlign: "center", marginBottom: 2 }}
			>
				Please enter your new password below.
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
					label="New Password"
					type="password"
					fullWidth
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>
				<TextField
					label="Confirm Password"
					type="password"
					fullWidth
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					sx={{ marginTop: 2, mx: "auto", width: "fit-content" }}
					disabled={loading}
				>
					{loading ? <Progress /> : "Reset Password"}
				</Button>
			</Box>
		</Container>
	);
};

export default PasswordReset;
