import express from "express";
import Assignment from "../models/Assignment.js";

const router = express.Router();

// Create an Assignment
router.post("/", async (req, res) => {
	try {
		const assignment = new Assignment(req.body);
		await assignment.save();
		res.status(201).json(assignment);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Assignments
router.get("/", async (req, res) => {
	try {
		const assignments = await Assignment.find();
		res.json(assignments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single Assignment
router.get("/:id", async (req, res) => {
	try {
		const assignment = await Assignment.findById(req.params.id);
		if (!assignment)
			return res.status(404).json({ message: "Assignment not found" });
		res.json(assignment);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an Assignment
router.put("/:id", async (req, res) => {
	try {
		const assignment = await Assignment.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.json(assignment);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete an Assignment
router.delete("/:id", async (req, res) => {
	try {
		await Assignment.findByIdAndDelete(req.params.id);
		res.json({ message: "Assignment deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
