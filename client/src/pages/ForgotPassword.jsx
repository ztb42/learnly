import React, { useState } from "react";
import "../styles/pages/ForgotPassword.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password?</h2>
      <p className="instruction-text">
        Enter your email address below, and if an account exists, we’ll send you
        an email with instructions to reset your password.
        <br />
        <span className="spam-warning">
          Don’t forget to check your spam folder!
        </span>
      </p>

      <form className="forgot-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;


