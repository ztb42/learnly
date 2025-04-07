import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
	training: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingProgram",
		required: true,
	},
	employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	assignedByManager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
