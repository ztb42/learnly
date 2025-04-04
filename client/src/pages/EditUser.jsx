import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditUser = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		role: "",
	});
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false); // Para el diálogo de eliminar

	useEffect(() => {
		fetch(`http://localhost:5050/api/users/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setForm({
					firstName: data.firstName,
					lastName: data.lastName,
					username: data.username,
					email: data.email,
					role: data.role?._id || "",
				});
				setLoading(false);
			})
			.catch((err) => {
				console.error("❌ Error fetching user:", err);
				setLoading(false);
			});
	}, [id]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`http://localhost:5050/api/users/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();

		if (res.ok) {
			enqueueSnackbar("User updated successfully!", { variant: "success" });
			setTimeout(() => navigate("/users"), 800);
		} else {
			enqueueSnackbar(data.message || "Update failed", { variant: "error" });
		}
	};

	const handleDelete = async () => {
		try {
			const res = await fetch(`http://localhost:5050/api/users/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (res.ok) {
				enqueueSnackbar("User deleted successfully", { variant: "success" });
				setTimeout(() => navigate("/users"), 800);
			} else {
				enqueueSnackbar(data.message || "Error deleting user", { variant: "error" });
			}
		} catch (error) {
			enqueueSnackbar("Server error: " + error.message, { variant: "error" });
		}
		setOpen(false);
	};

	if (loading) return <Typography>Loading user...</Typography>;

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4">Edit User</Typography>

			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
				<TextField
					label="First Name"
					name="firstName"
					value={form.firstName}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Last Name"
					name="lastName"
					value={form.lastName}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Username"
					name="username"
					value={form.username}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Email"
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>

				<Box display="flex" justifyContent="flex-start" gap={2} mt={3}>
					<Button type="submit" variant="contained" color="primary">
						Update
					</Button>
					<Button
						variant="outlined"
						color="error"
						onClick={() => setOpen(true)}
					>
						Delete User
					</Button>
				</Box>
			</Box>

			{/* Dialog de confirmación de eliminar */}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					Are you sure you want to delete this user?
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default EditUser;
