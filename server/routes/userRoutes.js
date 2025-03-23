import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, username, email, password, role } =
			req.body;

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			role,
		});

		await newUser.save();
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Login a user
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).populate("role");

		if (!user) return res.status(404).json({ message: "User not found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" });

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ token, user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all users
router.get("/", async (req, res) => {
	try {
		const users = await User.find().populate("role");
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a user by ID
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("role");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a user by ID
router.put("/:id", async (req, res) => {
	try {
		const { firstName, lastName, username, email, password, role } =
			req.body;

		// Find user by ID
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Update user fields if provided
		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (username) user.username = username;
		if (email) user.email = email;
		if (role) user.role = role;

		// Hash new password if it's provided
		if (password) {
			user.password = await bcrypt.hash(password, 10);
		}

		await user.save();
		res.json({ message: "User updated successfully", user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		await user.remove();
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
