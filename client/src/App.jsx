import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CreateTraining from "./pages/CreateTraining";
import TrainingPrograms from "./pages/TrainingPrograms";
import ErrorPage from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import CreateUser from "./pages/CreateUser";
import "./styles/main.scss";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			errorElement: <ErrorPage />,
			children: [
				{
					index: true,
					element: <Dashboard />,
				},
				{ path: "user-management", element: <UserManagement /> },
				{ path: "create-training", element: <CreateTraining /> },
				{ path: "training-programs", element: <TrainingPrograms /> },
				{ path: "login", element: <Login /> },
        		{ path: "forgot-password", element: <ForgotPassword /> },
        		{ path: "create-user", element: <CreateUser /> },
				// Example of adding a new route
				// {
				//   path: 'login',
				//   element: <Login />
				// }
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
