import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";

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
