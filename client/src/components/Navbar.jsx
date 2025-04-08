import { useState } from "react";
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ColoredAvatar from "./ColoredAvatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMobileOpen(open);
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/training-programs", label: "Trainings" },
    { path: "/users", label: "Users" },
    // { path: "/login", label: "Login" },
    // { path: "/forgot-password", label: "Forgot Password" },
    // { path: "/users/new", label: "User Creation" },
    // { path: "/training-programs/new", label: "Training Creation" },
  ];

  return (
    <nav className="navbar">
      <div className="container-fluid ps-0 d-flex align-items-center">
        <div className="logo-container">
          <NavLink to="/" className="logo">
            <img src="/transparentLogo.png" alt="Logo" className="me-2" />
            <span>Learnly</span>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          className="d-lg-none"
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Navigation */}
        <div className="d-none d-lg-flex align-items-center flex-grow-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-link ${index === 2 ? "me-auto" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="#" className="nav-link" onClick={logout}>
            Log Out
          </NavLink>
          <div className="nav-link logo mx-3">
            <ColoredAvatar
              name={user ? `${user.firstName} ${user.lastName}` : ""}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="#"
              onClick={() => {
                logout();
                toggleDrawer(false);
              }}
            >
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </nav>
  );
};

export default Navbar;
