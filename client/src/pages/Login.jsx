import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      const response = await fetch("http://localhost:5050/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
      } else {
        alert("Login successful!");
        console.log("User data:", data.user);
        console.log("Token:", data.token);
        // Optional: localStorage.setItem("token", data.token);
        navigate("/"); // or "/dashboard"
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 2,
        marginTop: "3rem",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          Learnly Training App
        </Link>
      </Typography>

      {/* <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <img
          src="/transparentLogo.png"
          alt="Logo"
          style={{ width: "180px", height: "auto" }}
        />
      </Box> */}

      {/* //Andrew changed */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <img
          src="/transparentLogo.png"
          alt="Logo"
          style={{ width: "180px", height: "auto" }}
        />
      </Box>
      {/* //end Andrew changed */}

      <Typography variant="h5" component="p">
        Login
      </Typography>
      <Divider sx={{ width: "100%", my: 5 }} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          error={!!passwordError}
          helperText={passwordError}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/forgot-password" style={{ fontSize: "0.9rem" }}>
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
            mx: "auto",
            width: "fit-content",
            px: 4,
          }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Divider,
//   Container,
// } from "@mui/material";
// import { Link } from "react-router-dom"; // ✅ FIXED: Correct Link source
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameError, setUsernameError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let hasError = false;

//     if (!username) {
//       setUsernameError("Username is required.");
//       hasError = true;
//     } else {
//       setUsernameError("");
//     }

//     if (!password) {
//       setPasswordError("Password is required.");
//       hasError = true;
//     } else {
//       setPasswordError("");
//     }

//     if (hasError) return;

//     console.log("Logging in with:", username, password);
//     // Example redirect after successful login:
//     navigate("/dashboard");
//   };

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         padding: 2,
//         marginTop: "3rem",
//       }}
//     >
//       <Typography variant="h4" component="h1" gutterBottom>
//         Learnly Training App
//       </Typography>

//       <Box
//         component="div"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           marginBottom: 2,
//         }}
//       >
//         <img
//           src="/transparentLogo.png"
//           alt="Logo"
//           style={{ width: "180px", height: "auto" }}
//         />
//       </Box>

//       <Typography variant="h5" component="p">
//         Login
//       </Typography>
//       <Divider sx={{ width: "100%", my: 5, opacity: 1 }} />

//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           width: "100%",
//         }}
//       >
//         <TextField
//           label="Username"
//           variant="outlined"
//           fullWidth
//           value={username}
//           onChange={(e) => {
//             setUsername(e.target.value);
//             if (e.target.value) setUsernameError("");
//           }}
//           error={!!usernameError}
//           helperText={usernameError}
//         />

//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           value={password}
//           onChange={(e) => {
//             setPassword(e.target.value);
//             if (e.target.value) setPasswordError("");
//           }}
//           error={!!passwordError}
//           helperText={passwordError}
//         />

//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <Link to="/forgot-password">Forgot Password?</Link>
//         </Box>

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           sx={{
//             marginTop: 2,
//             mx: "auto",
//             width: "fit-content",
//             px: 4,
//           }}
//         >
//           Login
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Login;