import {
	Box,
	Button,
	Card,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ColoredAvatar from "../ColoredAvatar";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";

const UserCard = ({ user, handleUserDelete, sx }) => {
	const { user: loggedInUser } = useAuth();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);

	// Initialize useApi for the users endpoint
	const { deleteItem } = useApi("/api/users");

	const handleDelete = async () => {
		try {
			await deleteItem(user._id);

			enqueueSnackbar("User deleted successfully", {
				variant: "success",
			});

			handleUserDelete(); // Tell parent component to refetch users
		} catch (error) {
			enqueueSnackbar(error || "Error deleting user", {
				variant: "error",
			});
		}
		setOpen(false);
	};

	return (
		<Card variant="outlined" sx={{ ...sx, mt: 2, p: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<ColoredAvatar name={`${user.firstName} ${user.lastName}`} />
				<Box sx={{ ml: 2, flexGrow: 1 }}>
					<Typography variant="body1">
						{`${user.firstName} ${user.lastName}`}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						{user.username}
					</Typography>
				</Box>

				<Box display="flex" gap={1}>
					<Link to={`/users/${user._id}/edit`}>
						<Button variant="outlined" color="primary">
							Edit
						</Button>
					</Link>

					<Button
						variant="outlined"
						color="error"
						disabled={loggedInUser._id === user._id}
						onClick={() => setOpen(true)}
					>
						Delete
					</Button>
				</Box>
			</Box>

			{/* Dialog Confirmation */}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Delete User</DialogTitle>
				<DialogContent>
					Are you sure you want to delete{" "}
					<b>{`${user.firstName} ${user.lastName}`}</b>?
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleDelete} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default UserCard;
