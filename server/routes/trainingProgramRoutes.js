import express from "express";
import TrainingProgram from "../models/TrainingProgram.js";
import TrainingSession from "../models/TrainingSession.js";
import Assignment from "../models/Assignment.js";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { sessions, ...trainingData } = req.body;

		// Create the training program
		const training = new TrainingProgram(trainingData);
		await training.save();

		// Create associated sessions
		if (sessions && sessions.length > 0) {
			const sessionDocs = sessions.map((session) => ({
				...session,
				training: training._id, // Link the session to the training program
			}));
			await TrainingSession.insertMany(sessionDocs);
		}

		res.status(201).json(training);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a Training Program
router.put("/:id", async (req, res) => {
	try {
		const { sessions, ...trainingData } = req.body;

		// Update the training program
		const training = await TrainingProgram.findByIdAndUpdate(
			req.params.id,
			trainingData,
			{ new: true }
		);

		// Update associated sessions
		if (sessions && sessions.length > 0) {
			// Remove existing sessions for this training program
			await TrainingSession.deleteMany({ training: training._id });

			// Add the new sessions
			const sessionDocs = sessions.map((session) => ({
				...session,
				training: training._id,
			}));
			await TrainingSession.insertMany(sessionDocs);
		}

		res.json(training);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// // Get all Training Programs
router.get("/", async (req, res) => {
	try {
		const trainings = await TrainingProgram.find().populate({
			path: "manager",
		});
		// 👈 this is the key fix!
		res.json(trainings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Programs for a specific Manager
router.get("/manager/:managerId", async (req, res) => {
	try {
		const trainings = await TrainingProgram.find({
			manager: req.params.managerId,
		}).populate("manager");
		res.json(trainings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Programs for a specific Trainer
router.get("/trainer/:trainerId", async (req, res) => {
	try {
		// Find all training sessions for the trainer
		const sessions = await TrainingSession.find({
			trainer: req.params.trainerId,
		}).select("training"); // Only select the training field

		// Extract unique training program IDs
		const trainingIds = [
			...new Set(sessions.map((session) => session.training)),
		];

		// Find the training programs using the extracted IDs
		const trainings = await TrainingProgram.find({
			_id: { $in: trainingIds },
		});

		res.json(trainings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all Training Programs for a specific Employee
router.get("/employee/:employeeId", async (req, res) => {
	try {
		// Find all assignments for the employee
		const assignments = await Assignment.find({
			employee: req.params.employeeId,
		}).select("trainingId"); // Only select the trainingId field

		// Extract unique training program IDs
		const trainingIds = [
			...new Set(assignments.map((assignment) => assignment.trainingId)),
		];

		// Find the training programs using the extracted IDs
		const trainings = await TrainingProgram.find({
			_id: { $in: trainingIds },
		});

		res.json(trainings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single Training Program
router.get("/:id", async (req, res) => {
	try {
		const training = await TrainingProgram.findById(req.params.id).populate(
			"manager"
		);
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
		if (sessions && sessions.length > 0) {
			// Remove existing sessions for this training program
			await TrainingSession.deleteMany({ training: training._id });
		}
		res.json({ message: "Training Program deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
