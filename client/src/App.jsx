import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement"; 
import CreateTraining from "./pages/CreateTraining"; 

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: [
				{
					index: true,
					element: <Dashboard />,
				},
				{ path: "user-management", element: <UserManagement /> }, 
				{ path: "create-training", element: <CreateTraining /> }, 
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
