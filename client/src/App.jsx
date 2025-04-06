import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import TrainingPrograms from "./pages/TrainingPrograms";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import ErrorPage from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoute";
import UserForm from "./pages/UserForm";
import TrainingForm from "./pages/TrainingForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
				// Protected routes
				{
					element: (
						<ProtectedRoute
							allowedRoles={[
								"Admin",
								"Manager",
								"Trainer",
								"Employee",
							]}
						/>
					),
					children: [
						{ index: true, element: <Dashboard /> },

						{
							path: "training-programs",
							children: [
								{ index: true, element: <TrainingPrograms /> },
								{ path: "new", element: <TrainingForm /> },
								// {
								// 	path: ":id",
								// 	element: <TrainingDetails />,
								// },
								{
									path: ":id/edit",
									element: <TrainingForm />,
								},
							],
						},

						// ✅ USER routes (updated and working)
						{
							path: "users",
							element: (
								<ProtectedRoute
									allowedRoles={[
										"Admin",
										"Manager",
										"Trainer",
									]}
								/>
							),
							children: [
								{
									index: true,
									element: <UserManagement />,
								},
								{
									path: "new",
									element: (
										<ProtectedRoute
											allowedRoles={["Admin"]}
										>
											<UserForm />
										</ProtectedRoute>
									),
								},
								{
									path: ":id/edit",
									element: (
										<ProtectedRoute
											allowedRoles={["Admin"]}
										>
											<UserForm />
										</ProtectedRoute>
									),
								},
							],
						},
					],
				},
			],
		},
	]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<SnackbarProvider maxSnack={3} autoHideDuration={3000}>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</SnackbarProvider>
		</LocalizationProvider>
	);
}

export default App;
