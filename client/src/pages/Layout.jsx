import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "light",
	},
});

const Layout = () => {
	return (
		<ThemeProvider theme={theme}>
			<Navbar />
			<Outlet />
		</ThemeProvider>
	);
};

export default Layout;
