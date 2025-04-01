import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    console.log("Logging in with:", username, password);
  };

  return (
    <div className="login-page">
      <h1 className="title">
        <a href="/login">Learnly Training App</a>
      </h1>

      <div className="logo-wrapper">
        <img src="/transparentLogo.png" alt="Logo" className="logo-image" />
      </div>

      <div className="logo-background" />

      <p className="form-heading">Login</p>
      <hr className="divider" />

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value) setUsernameError("");
            }}
          />
          {usernameError && (
            <div className="error-message">{usernameError}</div>
          )}
        </div>
        <br />

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value) setPasswordError("");
            }}
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <br />

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
