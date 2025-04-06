import mongoose from "mongoose";

const completionStatusSchema = new mongoose.Schema({
	assignment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment",
		required: true,
	},
	trainer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	completionDate: { type: Date, required: true },
	status: { type: String, enum: ["Completed", "Pending"], required: true },
});

const CompletionStatus = mongoose.model(
	"CompletionStatus",
	completionStatusSchema
);
export default CompletionStatus;
