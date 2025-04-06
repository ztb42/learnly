import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
	const { user } = useAuth();
	const currentRole = user?.role?.roleName;

	// If user is not logged in, redirect to login
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// If user is logged in but doesn't have the correct role, redirect
	if (!allowedRoles.includes(currentRole)) {
		return <Navigate to="/not-authorized" replace />;
	}

	// Render the protected component
	return <Outlet />;
};

export default ProtectedRoute;
