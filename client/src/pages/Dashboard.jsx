import React, { useMemo, useState } from "react";
import {
	Box,
	Button,
	Container,
	Grid2,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import CategoryCard from "../components/dashboard/CategoryCard";
import useApi from "../hooks/useApi";
import AddIcon from "@mui/icons-material/Add";
import TrainingCard from "../components/dashboard/TrainingCard";
import UserCard from "../components/dashboard/UserCard";
import Progress from "../components/Progress";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
	const { user } = useAuth();
	// Safely access the role name
	const currentRole = user?.role?.roleName || "Guest";
	const [searchQuery, setSearchQuery] = useState("");

	let trainingsEndpoint = "/api/training-programs";
	let usersEndpoint = "/api/users";
	if (currentRole === "Manager") {
		trainingsEndpoint = `/api/training-programs/manager/${user._id}`;
		usersEndpoint = "/api/users/role/Employee";
	} else if (currentRole === "Trainer") {
		trainingsEndpoint = `/api/training-programs/trainer/${user._id}`;
		usersEndpoint = `/api/users/trainer/${user._id}/employees`;
	} else if (currentRole === "Employee") {
		trainingsEndpoint = `/api/training-programs/employee/${user._id}`;
	}

	const { data: trainings = [], loading: trainingsLoading } =
		useApi(trainingsEndpoint);
	const {
		data: users,
		loading: usersLoading,
		refetch,
	} = useApi(usersEndpoint, currentRole !== "Employee");

	const filteredTrainings = trainings.filter((training) => {
		const title = training.title?.toLowerCase() || "";
		const description = training.description?.toLowerCase() || "";
		const query = searchQuery.toLowerCase();
		return title.includes(query) || description.includes(query);
	});

	// --- Auto-Categorization Logic ---
	const categorizeTraining = (training) => {
		const description = training.description?.toLowerCase() || "";

		// Define a mapping of categories to their keywords
		const categoryKeywords = {
			Frontend: ["react", "html", "css", "design", "frontend"],
			Backend: ["node", "express", "api", "backend", "database"],
		};

		// Find the first category whose keywords match the description
		for (const [category, keywords] of Object.entries(categoryKeywords)) {
			if (keywords.some((keyword) => description.includes(keyword))) {
				return category;
			}
		}

		// Default category if no match is found
		return "Other";
	};

	const categorizedTrainings = trainings.reduce((acc, training) => {
		const category = categorizeTraining(training);
		if (!acc[category]) acc[category] = [];
		acc[category].push(training);
		return acc;
	}, {});

	const categoryImages = {
		Frontend:
			"https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		Backend:
			"https://plus.unsplash.com/premium_photo-1661386257356-c17257862be8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRhdGFiYXNlfGVufDB8fDB8fHww",
		Other: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	};

	const randomUsers = useMemo(() => {
		const randomUserCount = Math.floor(Math.random() * 30) + 1;
		return [...users]
			.sort(() => 0.5 - Math.random())
			.slice(0, randomUserCount);
	}, [users]);

	// Optional: fallback image
	const defaultImage =
		"https://images.unsplash.com/photo-1507209696999-3c532be9b2b8";

	return (
		<Container
			className="dashboard"
			maxWidth="lg"
			sx={{ p: 2, mt: "3rem" }}
		>
			<Typography component="h1" variant="h4" gutterBottom>
				{currentRole} Dashboard
			</Typography>
			<TextField
				label="Search Trainings"
				fullWidth
				sx={{ mb: 4 }}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{["Admin", "Manager"].includes(currentRole) && (
				<Box>
					<Typography component="h2" variant="h5" mb={3}>
						Training Categories
					</Typography>
					<Grid2 container spacing={8} mb={6}>
						{Object.entries(categorizedTrainings)
							.sort(([a], [b]) => {
								if (a === "Other") return 1; // Move "Other" to the end
								if (b === "Other") return -1;
								return a.localeCompare(b); // Sort alphabetically otherwise
							})
							.map(([categoryName, categoryTrainings]) => {
								return (
									<Grid2
										key={categoryName}
										size={{ xs: 12, sm: 6, md: 4 }}
									>
										<CategoryCard
											category={{
												name: categoryName,
												trainings:
													categoryTrainings.length,
												progress:
													Math.round(
														categoryTrainings.reduce(
															(sum, t) =>
																sum +
																(t.progress ||
																	0),
															0
														) /
															categoryTrainings.length
													) || 0,
												image:
													categoryImages[
														categoryName
													] || defaultImage,
											}}
											users={randomUsers} // Use memoized random users
										/>
									</Grid2>
								);
							})}
					</Grid2>
				</Box>
			)}

			<Grid2 container spacing={8} sx={{ minHeight: "550px" }}>
				<TrainingsSection
					trainings={filteredTrainings}
					trainingsLoading={trainingsLoading}
				/>

				<UsersSection
					users={users}
					usersLoading={usersLoading}
					refetch={refetch}
					currentRole={currentRole}
				/>
			</Grid2>
		</Container>
	);
};

export default Dashboard;

const TrainingsSection = ({ trainings, trainingsLoading }) => {
	return (
		<Grid2
			size={{ xs: 12, sm: 6 }}
			sx={{ display: "flex", flexDirection: "column" }}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Typography component="h2" variant="h5" sx={{ flexGrow: 1 }}>
					Trainings
				</Typography>
				<Link to="/training-programs/new">
					<IconButton sx={{ mr: 2 }}>
						<AddIcon />
					</IconButton>
				</Link>
				<Link to="/training-programs">
					<Button variant="contained" color="primary">
						View All
					</Button>
				</Link>
			</Box>

			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{trainings.length === 0 && (
					<Typography
						variant="body1"
						color="textSecondary"
						align="center"
					>
						No trainings found.
					</Typography>
				)}
				{trainingsLoading ? (
					<Progress
						sx={{
							margin: "40px auto",
						}}
					/>
				) : (
					trainings
						.slice(0, 3)
						.map((training) => (
							<TrainingCard
								key={training._id}
								training={training}
							/>
						))
				)}
			</Box>
		</Grid2>
	);
};

const UsersSection = ({ users, usersLoading, refetch, currentRole }) => {
	const handleUserDelete = () => {
		refetch(); // Refetch users after deletion
	};

	return (
		<Grid2
			size={{ xs: 12, sm: 6 }}
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Typography component="h2" variant="h5" sx={{ flexGrow: 1 }}>
					{currentRole === "Admin" ? "Users" : "Employees"}
				</Typography>
				<Link to="/users/new">
					<IconButton sx={{ mr: 2 }}>
						<AddIcon />
					</IconButton>
				</Link>
				<Link to="/users">
					<Button variant="contained" color="primary">
						View All
					</Button>
				</Link>
			</Box>

			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{usersLoading ? (
					<Progress
						sx={{
							margin: "40px auto",
						}}
					/>
				) : (
					users
						.slice(0, 7)
						.map((user) => (
							<UserCard
								key={user._id}
								user={user}
								handleUserDelete={handleUserDelete}
							/>
						))
				)}
			</Box>
		</Grid2>
	);
};
