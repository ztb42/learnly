import { Box, Button, Card, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ColoredAvatar from "../ColoredAvatar";

const UserCard = ({ user, sx }) => {
	const name = `${user.firstName} ${user.lastName}`;
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		try {
			const res = await fetch(`http://localhost:5050/api/users/${user._id}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (res.ok) {
				enqueueSnackbar("User deleted successfully", { variant: "success" });
				setTimeout(() => {
					window.location.reload();
				}, 800); // espera 800ms antes de recargar

			} else {
				enqueueSnackbar(data.message || "Error deleting user", { variant: "error" });
			}
		} catch (error) {
			enqueueSnackbar("Server error: " + error.message, { variant: "error" });
		}
		setOpen(false);
	};

	return (
		<Card variant="outlined" sx={{ ...sx, mt: 2, p: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<ColoredAvatar name={name} />
				<Box sx={{ ml: 2, flexGrow: 1 }}>
					<Typography variant="body1">{name}</Typography>
					<Typography variant="body2" color="textSecondary">
						{user.username}
					</Typography>
				</Box>

				<Box display="flex" gap={1}>
					<Link to={`/users/${user._id}/edit`}>
						<Button variant="outlined" color="primary">Edit</Button>
					</Link>
					<Button variant="outlined" color="error" onClick={() => setOpen(true)}>
						Delete
					</Button>
				</Box>
			</Box>

			{/* Dialog Confirmación */}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Delete User</DialogTitle>
				<DialogContent>
					Are you sure you want to delete <b>{name}</b>?
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleDelete} color="error">Delete</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default UserCard;
