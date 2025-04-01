import {
	Container,
	Typography,
	TextField,
	Box,
	Button,
	Tabs,
	Tab,
	Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import UserCard from "../components/dashboard/UserCard";
import Progress from "../components/Progress";

const UserManagement = () => {
	const { data: users, loading: usersLoading } = useApi("/api/users");
	const { data: roles, loading: rolesLoading } = useApi("/api/roles");

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [activeRole, setActiveRole] = useState(""); // Initially empty

	// Set the default active role once roles are fetched
	useEffect(() => {
		if (roles && roles.length > 0 && !activeRole) {
			setActiveRole(roles[0]._id); // Default to the first role's ID
		}
	}, [roles, activeRole]);

	// Filter users by search + active role
	const filteredUsers = users.filter((user) => {
		const name = user.firstName + " " + user.lastName;
		return (
			user.role._id === activeRole && // Compare the role's _id
			name.toLowerCase().includes(search.toLowerCase()) // Match the search term
		);
	});

	const handlePageChange = (_, value) => setPage(value);

	const handleTabChange = (_, newValue) => {
		setActiveRole(roles[newValue]._id); // Use the role's `_id`
		setPage(1); // Reset to the first page when switching roles
	};

	return (
		<Container
			className="users-page"
			maxWidth="md"
			sx={{
				marginTop: "2rem",
			}}
		>
			<Typography variant="h4" gutterBottom>
				Users
			</Typography>

			{rolesLoading ? (
				<Progress
					sx={{
						margin: "40px auto",
						display: "block",
					}}
				/>
			) : (
				<>
					{/* Role Tabs */}
					{roles && (
						<Tabs
							value={roles.findIndex(
								(role) => role._id === activeRole
							)}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
						>
							{roles.map((role) => (
								<Tab key={role._id} label={role.roleName} />
							))}
						</Tabs>
					)}

					{/* Search Input */}
					<TextField
						fullWidth
						label={`Search ${roles
							.find((role) => role._id === activeRole)
							?.roleName.toLowerCase()}s...`}
						variant="outlined"
						margin="normal"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					{/* User List */}
					<Box mt={2}>
						{usersLoading ? (
							<Progress
								sx={{
									margin: "40px auto",
								}}
							/>
						) : (
							<>
								{filteredUsers.map((user) => (
									<UserCard key={user._id} user={user} />
								))}
							</>
						)}
					</Box>

					{/* Footer Buttons */}
					<Box
						mt={4}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Button variant="contained" color="primary">
							Add User
						</Button>
						<Pagination
							count={1}
							page={page}
							onChange={handlePageChange}
						/>
					</Box>
				</>
			)}
		</Container>
	);
};

export default UserManagement;
