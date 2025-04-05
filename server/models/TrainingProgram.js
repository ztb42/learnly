import mongoose from "mongoose";

const trainingProgramSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	duration: { type: Number, required: true },
	manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false,
	},
	deadline: { type: Date, required: true },
});

const TrainingProgram = mongoose.model(
	"TrainingProgram",
	trainingProgramSchema
);
export default TrainingProgram;
