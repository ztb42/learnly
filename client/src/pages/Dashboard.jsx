import React from "react";
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
	const { data: trainings, loading: trainingsLoading } = useApi(
		"/api/training-programs"
	);
	const { data: users, loading: usersLoading } = useApi("/api/users");
	const { user } = useAuth();

	// Safely access the role name
	const currentUserRole = user?.role?.roleName || "Guest";

	return (
		<Container
			className="dashboard"
			maxWidth="lg"
			sx={{ p: 2, mt: "3rem" }}
		>
			<Typography component="h1" variant="h4" gutterBottom>
				{currentUserRole} Dashboard
			</Typography>

			<TextField label="Search Trainings" fullWidth sx={{ mb: 4 }} />

			<Typography component="h2" variant="h5" mb={3}>
				Training Categories
			</Typography>
			<Grid2 container spacing={8} mb={6}>
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
					<CategoryCard
						category={{
							name: "Web Design",
							projects: 12,
							progress: 80,
							image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						}}
					/>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
					<CategoryCard
						category={{
							name: "Backend",
							projects: 20,
							progress: 60,
							image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						}}
					/>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
					<CategoryCard
						category={{
							name: "Data Science",
							projects: 8,
							progress: 40,
							image: "https://plus.unsplash.com/premium_photo-1661386257356-c17257862be8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRhdGFiYXNlfGVufDB8fDB8fHww",
						}}
					/>
				</Grid2>
			</Grid2>

			<Grid2 container spacing={8} sx={{ minHeight: "550px" }}>
				<TrainingsSection
					trainings={trainings}
					trainingsLoading={trainingsLoading}
				/>

				<UsersSection users={users} usersLoading={usersLoading} />
			</Grid2>
		</Container>
	);
};

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
				<Link to="/create-training">
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
				{trainingsLoading ? (
					<Progress
						sx={{
							margin: "40px auto",
						}}
					/>
				) : (
					trainings
						.slice(0, 4)
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

const UsersSection = ({ users, usersLoading }) => {
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
					Users
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
						.map((user) => <UserCard key={user._id} user={user} />)
				)}
			</Box>
		</Grid2>
	);
};

export default Dashboard;
