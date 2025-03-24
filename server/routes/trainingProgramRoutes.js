import express from "express";
import TrainingProgram from "../models/TrainingProgram.js";

const router = express.Router();

// Create a Training Program
router.post("/", async (req, res) => {
	try {
		const training = new TrainingProgram(req.body);
		await training.save();
		res.status(201).json(training);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Programs
router.get("/", async (req, res) => {
	try {
		const trainings = await TrainingProgram.find();
		res.json(trainings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single Training Program
router.get("/:id", async (req, res) => {
	try {
		const training = await TrainingProgram.findById(req.params.id);
		if (!training)
			return res
				.status(404)
				.json({ message: "Training Program not found" });
		res.json(training);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a Training Program
router.put("/:id", async (req, res) => {
	try {
		const training = await TrainingProgram.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.json(training);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a Training Program
router.delete("/:id", async (req, res) => {
	try {
		await TrainingProgram.findByIdAndDelete(req.params.id);
		res.json({ message: "Training Program deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
