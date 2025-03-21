import mongoose from "mongoose";

const CompletionStatusSchema = new mongoose.Schema({
	Enrollment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Enrollment",
		required: true,
	},
	Trainer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	CompletionDate: { type: Date, required: true },
	Status: { type: String, enum: ["Completed", "Pending"], required: true },
});

const CompletionStatus = mongoose.model(
	"CompletionStatus",
	CompletionStatusSchema
);
export default CompletionStatus;
