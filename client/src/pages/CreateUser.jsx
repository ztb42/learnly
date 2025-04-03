import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
	const navigate = useNavigate();

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
			if (!form[key]) {
				newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
			}
		});

		if (form.password !== form.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		//Andrew added
		console.log("Sending form to backend", form);
		//end Andrew Added

		// Submit to backend
		try {
			const res = await fetch("http://localhost:5050/api/users/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || "Failed to create user");
			} else {
				alert("User created successfully!");
				navigate("/");
			}
		} catch (err) {
			console.error("🔥 Error creating user:", err);
			alert("Server error: " + err.message);
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
				textAlign: "center",
				padding: 2,
				marginTop: "3rem",
			}}
		>
			<Typography variant="h4" component="h1" mb={3}>
				Create User
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
				<FormControl
					fullWidth
					sx={{ textAlign: "left" }}
					error={!!errors.role}
				>
					<InputLabel id="role-label">Role</InputLabel>
					<Select
						labelId="role-label"
						name="role"
						value={form.role}
						onChange={handleChange}
						label="Role"
					>
						<MenuItem value="Employee">Employee</MenuItem>
						<MenuItem value="Manager">Manager</MenuItem>
						<MenuItem value="Trainer">Trainer</MenuItem>
						<MenuItem value="Admin">Admin</MenuItem>
					</Select>
					<Typography variant="caption" color="error">
						{errors.role}
					</Typography>
				</FormControl>
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
					Submit
				</Button>
			</Box>
		</Container>
	);
};

export default CreateUser;


// import React, { useState } from "react";
// import {
// 	Box,
// 	Button,
// 	TextField,
// 	Typography,
// 	MenuItem,
// 	Select,
// 	InputLabel,
// 	FormControl,
// 	Container,
// } from "@mui/material";

// const CreateUser = () => {
// 	const [form, setForm] = useState({
// 		username: "",
// 		firstName: "",
// 		lastName: "",
// 		email: "",
// 		password: "",
// 		confirmPassword: "",
// 		role: "Employee",
// 	});
// 	const [errors, setErrors] = useState({});

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setForm({ ...form, [name]: value });
// 		setErrors({ ...errors, [name]: "" }); // Clear error for the field being updated
// 	};

// 	const handleSubmit = (e) => {
// 		e.preventDefault();

// 		// Validate all fields
// 		const newErrors = {};
// 		Object.keys(form).forEach((key) => {
// 			if (!form[key]) {
// 				newErrors[key] = `${
// 					key.charAt(0).toUpperCase() + key.slice(1)
// 				} is required.`;
// 			}
// 		});

// 		if (Object.keys(newErrors).length > 0) {
// 			setErrors(newErrors);
// 			return;
// 		}

// 		// Check if passwords match
// 		if (form.password !== form.confirmPassword) {
// 			alert("Passwords do not match!");
// 			return;
// 		}

// 		// Example: send data to backend API
// 		console.log("Submitting user:", form);

// 		// Reset form
// 		setForm({
// 			username: "",
// 			firstName: "",
// 			lastName: "",
// 			email: "",
// 			password: "",
// 			confirmPassword: "",
// 			role: "Employee",
// 		});
// 		setErrors({});
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
// 			<Typography variant="h4" component="h1" mb={3}>
// 				Create User
// 			</Typography>
// 			<Box
// 				component="form"
// 				onSubmit={handleSubmit}
// 				sx={{
// 					display: "flex",
// 					flexDirection: "column",
// 					width: "100%",
// 					gap: 3,
// 				}}
// 			>
// 				<TextField
// 					label="Username"
// 					name="username"
// 					fullWidth
// 					value={form.username}
// 					onChange={handleChange}
// 					error={!!errors.username}
// 					helperText={errors.username}
// 				/>
// 				<TextField
// 					label="First Name"
// 					name="firstName"
// 					fullWidth
// 					value={form.firstName}
// 					onChange={handleChange}
// 					error={!!errors.firstName}
// 					helperText={errors.firstName}
// 				/>
// 				<TextField
// 					label="Last Name"
// 					name="lastName"
// 					fullWidth
// 					value={form.lastName}
// 					onChange={handleChange}
// 					error={!!errors.lastName}
// 					helperText={errors.lastName}
// 				/>
// 				<TextField
// 					label="Email"
// 					name="email"
// 					type="email"
// 					fullWidth
// 					value={form.email}
// 					onChange={handleChange}
// 					error={!!errors.email}
// 					helperText={errors.email}
// 				/>
// 				<TextField
// 					label="Password"
// 					name="password"
// 					type="password"
// 					fullWidth
// 					value={form.password}
// 					onChange={handleChange}
// 					error={!!errors.password}
// 					helperText={errors.password}
// 				/>
// 				<TextField
// 					label="Confirm Password"
// 					name="confirmPassword"
// 					type="password"
// 					fullWidth
// 					value={form.confirmPassword}
// 					onChange={handleChange}
// 					error={!!errors.confirmPassword}
// 					helperText={errors.confirmPassword}
// 				/>
// 				<FormControl
// 					fullWidth
// 					sx={{ textAlign: "left" }}
// 					error={!!errors.role}
// 				>
// 					<InputLabel id="role-label">Role</InputLabel>
// 					<Select
// 						labelId="role-label"
// 						name="role"
// 						value={form.role}
// 						onChange={handleChange}
// 						label="Role"
// 					>
// 						<MenuItem value="Employee">Employee</MenuItem>
// 						<MenuItem value="Manager">Manager</MenuItem>
// 						<MenuItem value="Trainer">Trainer</MenuItem>
// 						<MenuItem value="Admin">Admin</MenuItem>
// 					</Select>
// 					<Typography variant="caption" color="error">
// 						{errors.role}
// 					</Typography>
// 				</FormControl>
// 				<Button
// 					type="submit"
// 					variant="contained"
// 					color="primary"
// 					sx={{
// 						marginTop: 2,
// 						mx: "auto",
// 						width: "fit-content",
// 						px: 4,
// 					}}
// 				>
// 					Submit
// 				</Button>
// 			</Box>
// 		</Container>
// 	);
// };

// export default CreateUser;
