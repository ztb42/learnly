import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleLogin = async (username, password, onSuccess) => {
		if (!username || !password) {
			setError("Username and password are required.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				`${BASE_URL}/api/users/login`,
				{ username, password },
				{ headers: { "Content-Type": "application/json" } }
			);

			const userData = response.data.user;
			setUser(userData); // Update user in AuthContext
			localStorage.setItem("user", JSON.stringify(userData)); // Persist session

			// Call the success callback if provided
			if (onSuccess) onSuccess();

			navigate("/");
		} catch (err) {
			if (err.response) {
				const status = err.response.status;
				setError(
					status === 400
						? "Invalid username or password."
						: status === 401
						? "Unauthorized. Please check your credentials."
						: status === 500
						? "Server error. Please try again later."
						: err.response.data?.message || "An error occurred."
				);
			} else if (err.request) {
				setError(
					"No response from server. Please check your network connection."
				);
			} else {
				setError(err.message || "An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Function to clear the error state
	const clearError = () => setError(null);

	return { loading, error, handleLogin, clearError };
};

export default useLogin;
