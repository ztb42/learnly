import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useSnackbar } from "notistack";

const UserForm = () => {
	const navigate = useNavigate();
	const { id } = useParams(); // Get the id from the URL params
	const { enqueueSnackbar } = useSnackbar();

	const {
		data: user,
		editItem,
		postItem,
	} = useApi(
		id ? `/api/users/${id}` : "/api/users/register",
		id ? true : false
	);
	const { data: roles } = useApi("/api/roles");

	const [form, setForm] = useState({
		username: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "Employee",
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (id && user) {
			// Populate the form with user data
			setForm({
				username: user.username || "",
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				password: "", // Leave password empty for security
				confirmPassword: "", // Leave confirmPassword empty
				role: user?.role?.roleName || "Employee",
			});
		}
	}, [id, user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		const newErrors = {};
		Object.keys(form).forEach((key) => {
			if (!form[key] && key !== "password" && key !== "confirmPassword") {
				newErrors[key] = `${
					key.charAt(0).toUpperCase() + key.slice(1)
				} is required.`;
			}
		});

		if (form.password !== form.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			if (id) {
				// Update user
				await editItem(form);
				enqueueSnackbar("User updated successfully!", {
					variant: "success",
				});
			} else {
				// Create user
				await postItem(form);
				enqueueSnackbar("User created successfully!", {
					variant: "success",
				});
			}
			navigate("/");
		} catch (err) {
			enqueueSnackbar(err || "Failed to save user", { variant: "error" });
		}

		// Reset form
		setForm({
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "Employee",
		});
		setErrors({});
	};

	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: 2,
				marginTop: "3rem",
			}}
		>
			<Typography variant="h4" component="h1" mb={3}>
				{id ? "Edit User" : "Create User"}
			</Typography>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					gap: 3,
				}}
			>
				<TextField
					label="Username"
					name="username"
					fullWidth
					value={form.username}
					onChange={handleChange}
					error={!!errors.username}
					helperText={errors.username}
				/>
				<TextField
					label="First Name"
					name="firstName"
					fullWidth
					value={form.firstName}
					onChange={handleChange}
					error={!!errors.firstName}
					helperText={errors.firstName}
				/>
				<TextField
					label="Last Name"
					name="lastName"
					fullWidth
					value={form.lastName}
					onChange={handleChange}
					error={!!errors.lastName}
					helperText={errors.lastName}
				/>
				<TextField
					label="Email"
					name="email"
					type="email"
					fullWidth
					value={form.email}
					onChange={handleChange}
					error={!!errors.email}
					helperText={errors.email}
				/>
				{id ? null : (
					<>
						<TextField
							label="Password"
							name="password"
							type="password"
							fullWidth
							value={form.password}
							onChange={handleChange}
							error={!!errors.password}
							helperText={errors.password}
						/>
						<TextField
							label="Confirm Password"
							name="confirmPassword"
							type="password"
							fullWidth
							value={form.confirmPassword}
							onChange={handleChange}
							error={!!errors.confirmPassword}
							helperText={errors.confirmPassword}
						/>
					</>
				)}
				<TextField
					fullWidth
					select
					label="Role"
					name="role"
					value={roles?.length ? form.role : ""}
					onChange={handleChange}
					error={!!errors.role}
					helperText={errors.role}
				>
					{roles?.length > 0 ? (
						roles.map((role) => (
							<MenuItem key={role._id} value={role.roleName}>
								{role.roleName}
							</MenuItem>
						))
					) : (
						<MenuItem value="" disabled>
							Loading roles...
						</MenuItem>
					)}
				</TextField>
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
					{id ? "Update" : "Submit"}
				</Button>
			</Box>
		</Container>
	);
};

export default UserForm;
