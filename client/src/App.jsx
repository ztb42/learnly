import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CreateTraining from "./pages/CreateTraining";
import TrainingPrograms from "./pages/TrainingPrograms";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateUser from "./pages/CreateUser";

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
				{
					path: "users",
					children: [
						{
							index: true,
							element: <UserManagement />,
						},
						{
							path: "new",
							element: <CreateUser />,
						},
						// {
						// 	path: ":userId",
						// }
					],
				},
				{
					path: "training-programs",
					children: [
						{
							index: true,
							element: <TrainingPrograms />,
						},
						{
							path: "new",
							element: <CreateTraining />,
						},
					],
				},
				{ path: "login", element: <Login /> },
				{ path: "forgot-password", element: <ForgotPassword /> },
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
