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

// Mark an assignment as complete
router.put("/mark-complete", async (req, res) => {
	try {
		const { assignmentId, employeeId } = req.body; // Extract IDs from the request body

		if (!assignmentId || !employeeId) {
			return res.status(400).json({
				message: "Assignment ID and Employee ID are required",
			});
		}

		const assignment = await Assignment.findOneAndUpdate(
			{ _id: assignmentId, employee: employeeId }, // Match both assignment and employee
			{ status: "Completed", completionDate: new Date() }, // Update status and completion date
			{ new: true } // Return the updated document
		);

		if (!assignment) {
			return res.status(404).json({
				message: "Assignment not found or does not match the employee",
			});
		}

		res.json({ message: "Assignment marked as complete", assignment });
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

// Get all employees assigned to a specific training program
router.get("/training/:trainingId/employees", async (req, res) => {
	try {
		const assignments = await Assignment.find({
			training: req.params.trainingId,
			status: "Assigned",
		}).populate("employee", "firstName lastName username email");

		const employees = assignments.map((a) => a.employee);
		res.json(employees);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all assignments for a specific training program (used to map employee to assignmentId)
router.get("/training/:trainingId", async (req, res) => {
	try {
		const assignments = await Assignment.find({
			training: req.params.trainingId,
		}).populate("employee", "firstName lastName email");
		res.json(assignments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
