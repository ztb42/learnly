import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Role from "../models/Role.js";
import TrainingProgram from "../models/TrainingProgram.js";
import TrainingSession from "../models/TrainingSession.js";
import Assignment from "../models/Assignment.js";
import Enrollment from "../models/Enrollment.js";
import CompletionStatus from "../models/CompletionStatus.js";
import { faker } from "@faker-js/faker";

dotenv.config();

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected for Seeding"))
	.catch((err) => console.error(err));

const seedDatabase = async () => {
	try {
		// Clear existing data
		await Role.deleteMany();
		await User.deleteMany();
		await TrainingProgram.deleteMany();
		await TrainingSession.deleteMany();
		await Assignment.deleteMany();
		await Enrollment.deleteMany();
		await CompletionStatus.deleteMany();

		// Create roles
		const roles = ["Admin", "Manager", "Trainer", "Employee"];
		const roleDocs = await Role.insertMany(roles.map((name) => ({ name })));

		// Generate users
		const users = [];
		for (let i = 0; i < 10; i++) {
			const hashedPassword = await bcrypt.hash("password123", 10);
			users.push({
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				username: faker.internet.userName(),
				email: faker.internet.email(),
				password: hashedPassword,
				role: roleDocs[Math.floor(Math.random() * roleDocs.length)]._id,
			});
		}
		const userDocs = await User.insertMany(users);

		// Generate training programs
		const trainingPrograms = [];
		for (let i = 0; i < 5; i++) {
			trainingPrograms.push({
				title: faker.lorem.words(3),
				description: faker.lorem.sentence(),
			});
		}
		const trainingProgramDocs = await TrainingProgram.insertMany(
			trainingPrograms
		);

		// Generate training sessions
		const trainingSessions = [];
		for (const program of trainingProgramDocs) {
			for (let i = 0; i < 3; i++) {
				trainingSessions.push({
					trainingProgram: program._id,
					date: faker.date.future(),
					duration: Math.floor(Math.random() * 4) + 1, // Random duration 1-4 hours
				});
			}
		}
		const trainingSessionDocs = await TrainingSession.insertMany(
			trainingSessions
		);

		// Assign users to training programs
		const assignments = [];
		for (const user of userDocs) {
			assignments.push({
				user: user._id,
				trainingProgram:
					trainingProgramDocs[
						Math.floor(Math.random() * trainingProgramDocs.length)
					]._id,
			});
		}
		const assignmentDocs = await Assignment.insertMany(assignments);

		// Enroll users in training sessions
		const enrollments = [];
		for (const user of userDocs) {
			for (let i = 0; i < 2; i++) {
				enrollments.push({
					user: user._id,
					trainingSession:
						trainingSessionDocs[
							Math.floor(
								Math.random() * trainingSessionDocs.length
							)
						]._id,
				});
			}
		}
		const enrollmentDocs = await Enrollment.insertMany(enrollments);

		// Generate completion statuses
		const completionStatuses = [];
		for (const enrollment of enrollmentDocs) {
			completionStatuses.push({
				enrollment: enrollment._id,
				status: Math.random() > 0.5 ? "Completed" : "Pending",
				score: Math.floor(Math.random() * 100),
			});
		}
		await CompletionStatus.insertMany(completionStatuses);

		console.log("Database seeded successfully! 🎉");
		mongoose.connection.close();
	} catch (error) {
		console.error("Error seeding database:", error);
		mongoose.connection.close();
	}
};

// Run seeding function
seedDatabase();

// To seed the database, run the following command in the terminal:
// node server/scripts/seedDatabase.js
