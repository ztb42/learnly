import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";

// Pages
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import CreateTraining from "./pages/CreateTraining";
import TrainingPrograms from "./pages/TrainingPrograms";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import ErrorPage from "./pages/Error";
import EditTraining from "./pages/EditTraining";


// Components
import ProtectedRoute from "./components/ProtectedRoute";

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
					element: <ProtectedRoute allowedRoles={["admin"]} />,
					children: [
						{ index: true, element: <Dashboard /> },

						
						{
							path: "training-programs",
							children: [
								{ index: true, element: <TrainingPrograms /> },
								{ path: "new", element: <CreateTraining /> },
								{ path: ":id/edit", element: <EditTraining /> }, 
	
							],
						},

						// ✅ USER routes (updated and working)
						{
							path: "users",
							children: [
								{ index: true, element: <UserManagement /> },    // /users
								{ path: "new", element: <CreateUser /> },       // /users/new
								{ path: ":id/edit", element: <EditUser /> },    // /users/:id/edit
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
