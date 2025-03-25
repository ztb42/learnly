import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
	employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	session: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingSession",
		required: true,
	},
	enrollmentDate: { type: Date, default: Date.now },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
