import React, { useState } from "react";

const CreateUser = () => {
	const [form, setForm] = useState({
		username: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "Employee",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		// Example: send data to backend API
		console.log("Submitting user:", form);

		// Reset form
		setForm({
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "Employee",
		});
	};

	return (
		<div className="create-user-page">
			<h2>Create User</h2>
			<form className="create-user-form" onSubmit={handleSubmit}>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={form.username}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="firstName"
					placeholder="First Name"
					value={form.firstName}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="lastName"
					placeholder="Last Name"
					value={form.lastName}
					onChange={handleChange}
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="confirmPassword"
					placeholder="Confirm Password"
					value={form.confirmPassword}
					onChange={handleChange}
					required
				/>
				<select name="role" value={form.role} onChange={handleChange}>
					<option>Employee</option>
					<option>Manager</option>
					<option>Trainer</option>
					<option>Admin</option>
				</select>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default CreateUser;
