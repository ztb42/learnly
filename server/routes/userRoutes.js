import express from "express";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
	console.log("📨 Received register request");

	try {
		const { firstName, lastName, username, email, password, role } =
			req.body;

		// 🔍 Check if user already exists
		const existingEmail = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });
		if (existingEmail) {
			console.warn("⚠️ User already exists with email:", email);
			return res
				.status(409)
				.json({ message: "A user with that email already exists." });
		}
		if (existingUsername) {
			console.warn("⚠️ User already exists with username:", username);
			return res
				.status(409)
				.json({ message: "A user with that username already exists." });
		}

		console.log("📥 Role sent from frontend:", role);
		const foundRole = await Role.findOne({ roleName: role.trim() });

		if (!foundRole) {
			console.error("❌ Role not found in DB:", role.trim());
			const allRoles = await Role.find();
			console.log(
				"📋 Available roles:",
				allRoles.map((r) => r.roleName)
			);
			return res.status(400).json({ message: `Invalid role: ${role}` });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			role: foundRole._id,
		});

		await newUser.save();
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		console.error("🔴 Registration error:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// Login a user
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username }).populate("role");

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
		console.error("🔴 Login error:", error);
		res.status(500).json({ error: error.message });
	}
});

// Forgot password
router.post("/reset-password", async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const tempPassword = Math.random().toString(36).slice(-8);
		const hashedPassword = await bcrypt.hash(tempPassword, 10);

		user.password = hashedPassword;
		await user.save();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: `Learnly <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Learnly Password Reset",
			text: `Here is your temporary password: ${tempPassword}\nPlease log in and change it immediately.`,
		};

		await transporter.sendMail(mailOptions);

		res.json({ message: "Temporary password sent to your email." });
	} catch (error) {
		console.error("🔴 Password reset failed:", error.message);
		res.status(500).json({
			message: "Server error during reset",
			error: error.message,
		});
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

// Get user by ID
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("role");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update user
router.put("/:id", async (req, res) => {
	try {
		const { firstName, lastName, username, email, password, role } =
			req.body;
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (username) user.username = username;
		if (email) user.email = email;
		if (role) user.role = role;

		if (password) {
			user.password = await bcrypt.hash(password, 10);
		}

		await user.save();
		res.json({ message: "User updated successfully", user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete user
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
