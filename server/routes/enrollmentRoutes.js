import express from "express";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

// Create an Enrollment
router.post("/", async (req, res) => {
	try {
		const enrollment = new Enrollment(req.body);
		await enrollment.save();
		res.status(201).json(enrollment);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Enrollments
router.get("/", async (req, res) => {
	try {
		const enrollments = await Enrollment.find();
		res.json(enrollments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
