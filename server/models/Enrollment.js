import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
	Employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	Session: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TrainingSession",
		required: true,
	},
	EnrollmentDate: { type: Date, default: Date.now },
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
