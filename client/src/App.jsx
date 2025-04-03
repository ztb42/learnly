import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CreateTraining from "./pages/CreateTraining";
import TrainingPrograms from "./pages/TrainingPrograms";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateUser from "./pages/CreateUser";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordReset from "./pages/PasswordReset";

function App() {
	const router = createBrowserRouter([
		{ path: "login", element: <Login /> },
		{ path: "forgot-password", element: <ForgotPassword /> },
		{ path: "reset-password", element: <PasswordReset /> },
		{
			path: "/",
			element: <Layout />,
			errorElement: <ErrorPage />,
			children: [
				// Public Routes

				// Protected Routes (All children require authentication)
				{
					element: <ProtectedRoute allowedRoles={["admin"]} />,
					children: [
						{ index: true, element: <Dashboard /> },
						{
							path: "training-programs",
							children: [
								{ index: true, element: <TrainingPrograms /> },
								{
									path: "new",
									element: (
										<ProtectedRoute
											allowedRoles={["admin"]}
										/>
									),
									children: [
										{
											index: true,
											element: <CreateTraining />,
										},
									],
								},
							],
						},
						{
							path: "users",
							element: (
								<ProtectedRoute allowedRoles={["admin"]} />
							),
							children: [
								{ index: true, element: <UserManagement /> },
								{ path: "new", element: <CreateUser /> },
							],
						},
					],
				},
			],
		},
	]);

	return (
		<SnackbarProvider maxSnack={3} autoHideDuration={3000}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</SnackbarProvider>
	);
}

export default App;
