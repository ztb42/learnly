import express from "express";
import TrainingSession from "../models/TrainingSession.js";

const router = express.Router();

// Create a Training Session
router.post("/", async (req, res) => {
	try {
		const session = new TrainingSession(req.body);
		await session.save();
		res.status(201).json(session);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Sessions
router.get("/", async (req, res) => {
	try {
		const sessions = await TrainingSession.find();
		res.json(sessions);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Sessions for a specific Training Program
router.get("/program/:trainingProgramId", async (req, res) => {
	try {
		const sessions = await TrainingSession.find({
			training: req.params.trainingProgramId,
		}).populate("trainer", "firstName lastName");
		res.json(sessions);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single Training Session
router.get("/:id", async (req, res) => {
	try {
		const session = await TrainingSession.findById(req.params.id);
		if (!session)
			return res.status(404).json({ message: "Session not found" });
		res.json(session);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a Training Session
router.put("/:id", async (req, res) => {
	try {
		const session = await TrainingSession.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.json(session);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a Training Session
router.delete("/:id", async (req, res) => {
	try {
		await TrainingSession.findByIdAndDelete(req.params.id);
		res.json({ message: "Training Session deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
