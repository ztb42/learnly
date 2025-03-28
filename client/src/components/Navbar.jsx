import { Avatar } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid ps-0">
        <div className="logo-container">
          <NavLink to="/" className="logo">
            <img src="/transparentLogo.png" alt="Logo" className="me-2" />
            <span>Learnly</span>
          </NavLink>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <NavLink to="/" className="nav-link me-auto">
            Dashboard
          </NavLink>
          <NavLink to="/login" className="nav-link ">
            Login
          </NavLink>
          <NavLink to="/forgot-Password" className="nav-link ">
            ForgotPassword
          </NavLink>
          <NavLink to="/create-User" className="nav-link ">
            UserCreation
          </NavLink>
          <NavLink to="/user-management" className="nav-link ">
            Users
          </NavLink>
          <NavLink to="/create-training" className="nav-link ">
            Training
          </NavLink>
          <NavLink to="/training-programs" className="nav-link ">
            Programs
          </NavLink>
          <NavLink to="/logout" className="nav-link">
            Log Out
          </NavLink>
          <NavLink to="/profile" className="nav-link logo mx-3">
            <Avatar />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
