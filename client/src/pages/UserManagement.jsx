import {
	Container,
	Typography,
	TextField,
	Box,
	Button,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Pagination,
	Tabs,
	Tab,
} from "@mui/material";
import { useState } from "react";

// Simulated data
const mockUsers = [
	{ id: 1, name: "Alice", role: "Manager" },
	{ id: 2, name: "Bob", role: "Trainer" },
	{ id: 3, name: "Charlie", role: "Employee" },
	{ id: 4, name: "Diana", role: "Manager" },
	{ id: 5, name: "Ethan", role: "Trainer" },
	{ id: 6, name: "Fiona", role: "Employee" },
];

const roles = ["Manager", "Trainer", "Employee"];

const UserManagement = () => {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [activeRole, setActiveRole] = useState("Manager");

	// Filter users by search + active role
	const filteredUsers = mockUsers.filter(
		(user) =>
			user.role === activeRole &&
			user.name.toLowerCase().includes(search.toLowerCase())
	);

	const handlePageChange = (_, value) => setPage(value);

	const handleTabChange = (_, newValue) => {
		setActiveRole(roles[newValue]);
		setPage(1); // reset to first page when switching roles
	};

	return (
		<Container className="users-page" maxWidth="md">
			<Typography variant="h4" gutterBottom>
				Users
			</Typography>

			{/* Role Tabs */}
			<Tabs
				value={roles.indexOf(activeRole)}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
			>
				{roles.map((role) => (
					<Tab key={role} label={role} />
				))}
			</Tabs>

			{/* Search Input */}
			<TextField
				fullWidth
				label={`Search ${activeRole.toLowerCase()}s...`}
				variant="outlined"
				margin="normal"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			{/* User List */}
			<Box mt={2}>
				<Divider />
				<List>
					{filteredUsers.map((user) => (
						<ListItem key={user.id}>
							<ListItemText primary={user.name} />
							<ListItemSecondaryAction>
								<Button variant="outlined" size="small">
									Edit
								</Button>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</Box>

			{/* Footer Buttons */}
			<Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
				<Button variant="contained" color="primary">
					Add User
				</Button>
				<Pagination count={1} page={page} onChange={handlePageChange} />
			</Box>
		</Container>
	);
};

export default UserManagement;

