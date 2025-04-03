import { enqueueSnackbar } from "notistack";
import { createContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	// Initialize state with localStorage data
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	// Function to update user state and persist to localStorage
	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	// Function to log out a user
	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		enqueueSnackbar("Logged out successfully", {
			variant: "success",
		});
	};

	return (
		<AuthContext.Provider value={{ user, setUser: login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
