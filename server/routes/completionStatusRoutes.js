import express from "express";
import CompletionStatus from "../models/CompletionStatus.js";

const router = express.Router();

// Create Completion Status
router.post("/", async (req, res) => {
	try {
		const completion = new CompletionStatus(req.body);
		await completion.save();
		res.status(201).json(completion);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Completion Statuses
router.get("/", async (req, res) => {
	try {
		const completions = await CompletionStatus.find().populate(
			"enrollment trainer"
		);
		res.json(completions);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
