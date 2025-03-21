import mongoose from "mongoose";

const TrainingProgramSchema = new mongoose.Schema({
	Title: { type: String, required: true },
	Description: { type: String },
	Duration: { type: Number, required: true },
	Manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	Deadline: { type: Date, required: true },
});

const TrainingProgram = mongoose.model(
	"TrainingProgram",
	TrainingProgramSchema
);
export default TrainingProgram;
