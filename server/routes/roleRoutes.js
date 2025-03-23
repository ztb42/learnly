import express from "express";
import Role from "../models/Role.js";

const router = express.Router();

// Create a new role
router.post("/", async (req, res) => {
	try {
		const { RoleName } = req.body;
		const newRole = new Role({ RoleName });
		await newRole.save();
		res.status(201).json(newRole);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all roles
router.get("/", async (req, res) => {
	try {
		const roles = await Role.find();
		res.json(roles);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
