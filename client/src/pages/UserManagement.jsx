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
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

const UserManagement = () => {
	const { user: loggedInUser } = useAuth();
	const currentRole = loggedInUser.role.roleName;

	// Define the appropriate endpoint based on role
	let usersEndpoint = "/api/users";
	if (currentRole === "Manager") {
		usersEndpoint = "/api/users/role/Employee";
	} else if (currentRole === "Trainer") {
		usersEndpoint = `/api/users/trainer/${loggedInUser._id}/employees`;
	}

	const {
		data: users,
		loading: usersLoading,
		refetch,
	} = useApi(usersEndpoint);
	const { data: roles, loading: rolesLoading } = useApi("/api/roles");

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [activeRole, setActiveRole] = useState(""); // Initially empty
	const USERS_PER_PAGE = 8;

	// Set the default active role once roles are fetched
	useEffect(() => {
		if (roles && roles.length > 0 && !activeRole) {
			if (currentRole === "Admin") {
				setActiveRole(roles[0]._id); // Default to the first role's ID for Admin
			} else {
				// For Manager and Trainer, find and set the Employee role
				const employeeRole = roles.find(
					(role) => role.roleName === "Employee"
				);
				if (employeeRole) {
					setActiveRole(employeeRole._id);
				}
			}
		}
	}, [roles, activeRole, currentRole]);

	// Filter users by search + active role
	const filteredUsers = users.filter((user) => {
		const name = user.firstName + " " + user.lastName;
		return (
			user.role._id === activeRole && // Compare the role's _id
			name.toLowerCase().includes(search.toLowerCase()) // Match the search term
		);
	});

	// Calculate pagination
	const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
	const paginatedUsers = filteredUsers.slice(
		(page - 1) * USERS_PER_PAGE,
		page * USERS_PER_PAGE
	);

	const handlePageChange = (_, value) => setPage(value);

	const handleTabChange = (_, newValue) => {
		setActiveRole(roles[newValue]._id); // Use the role's `_id`
		setPage(1); // Reset to the first page when switching roles
	};

	const handleUserDelete = () => {
		refetch(); // Refetch the users after deletion
	};

	// Filter roles based on current user's role
	const filteredRoles =
		currentRole === "Admin"
			? roles
			: roles.filter((role) => role.roleName === "Employee");

	return (
		<Container
			className="users-page"
			maxWidth="md"
			sx={{
				my: "2rem",
			}}
		>
			<Typography variant="h4" gutterBottom>
				{currentRole === "Admin" ? "Users" : "Employees"}
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
					{/* Role Tabs - Only show if there are roles and user is Admin */}
					{filteredRoles.length > 0 && currentRole === "Admin" && (
						<Tabs
							value={Math.max(
								filteredRoles.findIndex(
									(role) => role._id === activeRole
								),
								0
							)}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
						>
							{filteredRoles.map((role) => (
								<Tab key={role._id} label={role.roleName} />
							))}
						</Tabs>
					)}

					{/* Search Input */}
					<TextField
						fullWidth
						label={`Search ${
							currentRole === "Admin"
								? roles
										.find((role) => role._id === activeRole)
										?.roleName.toLowerCase()
								: "employee"
						}s...`}
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
									display: "block",
								}}
							/>
						) : (
							<>
								{paginatedUsers.map((user) => (
									<UserCard
										key={user._id}
										user={user}
										handleUserDelete={handleUserDelete}
									/>
								))}
							</>
						)}
					</Box>

					{/* Footer Buttons */}
					<Box
						mt={4}
						display="flex"
						justifyContent={
							currentRole === "Admin" ? "space-between" : "center"
						}
						alignItems="center"
					>
						{currentRole === "Admin" && (
							<Link to="/users/new">
								<Button variant="contained" color="primary">
									Add User
								</Button>
							</Link>
						)}
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
							color="primary"
						/>
					</Box>
				</>
			)}
		</Container>
	);
};

export default UserManagement;
