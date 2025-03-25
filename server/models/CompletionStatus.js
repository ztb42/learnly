import mongoose from "mongoose";

const completionStatusSchema = new mongoose.Schema({
	enrollment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Enrollment",
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
