import mongoose from "mongoose";

const TrainingSessionSchema = new mongoose.Schema({
	Training: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingProgram",
		required: true,
	},
	Trainer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	SessionDate: { type: Date, required: true },
	SessionTime: { type: String, required: true },
});

const TrainingSession = mongoose.model(
	"TrainingSession",
	TrainingSessionSchema
);
export default TrainingSession;
