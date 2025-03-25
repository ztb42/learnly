import mongoose from "mongoose";

const trainingSessionSchema = new mongoose.Schema({
	training: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingProgram",
		required: true,
	},
	trainer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	sessionDate: { type: Date, required: true },
	sessionTime: { type: String, required: true },
});

const TrainingSession = mongoose.model(
	"TrainingSession",
	trainingSessionSchema
);
export default TrainingSession;
