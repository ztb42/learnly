import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
	Training: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingProgram",
		required: true,
	},
	Employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	AssignedByManager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Assignment = mongoose.model("Assignment", AssignmentSchema);
export default Assignment;
