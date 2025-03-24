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

dotenv.config({ path: "../.env" });

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
		const roleDocs = await Role.insertMany(
			roles.map((name) => ({ RoleName: name }))
		);

		// Generate users
		const users = [];
		for (const role of roleDocs) {
			for (let i = 0; i < 3; i++) {
				const hashedPassword = await bcrypt.hash("password123", 10);
				users.push({
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					username: faker.internet.username(),
					email: faker.internet.email(),
					password: hashedPassword,
					role: role._id, // Assign the current role
				});
			}
		}
		const userDocs = await User.insertMany(users);

		// Fetch all managers to assign a valid Manager ID
		// Find the Manager role ID
		const managerRole = await Role.findOne({ RoleName: "Manager" });

		if (!managerRole) {
			console.error(
				"Manager role not found! Ensure roles are seeded correctly."
			);
			process.exit(1);
		}

		// Fetch all managers
		const managers = await User.find({ role: managerRole._id });

		if (managers.length === 0) {
			console.error(
				"No managers found! Ensure at least one manager exists."
			);
			process.exit(1); // Exit to prevent inserting invalid data
		}

		// Generate training programs
		const trainingPrograms = [];
		for (let i = 0; i < 5; i++) {
			trainingPrograms.push({
				Title: faker.lorem.words(3),
				Description: faker.lorem.sentence(),
				Manager:
					managers[Math.floor(Math.random() * managers.length)]._id, // Assign a random manager
				Duration: faker.number.int({ min: 1, max: 12 }), // Random duration (weeks/months)
				Deadline: faker.date.future(), // Future deadline
			});
		}

		const trainingProgramDocs = await TrainingProgram.insertMany(
			trainingPrograms
		);

		// Find the Trainer role ID
		const trainerRole = await Role.findOne({ RoleName: "Trainer" });

		if (!trainerRole) {
			console.error(
				"Trainer role not found! Ensure roles are seeded correctly."
			);
			process.exit(1);
		}

		// Fetch all trainers
		const trainers = await User.find({ role: trainerRole._id });

		if (trainers.length === 0) {
			console.error(
				"No trainers found! Ensure at least one trainer exists."
			);
			process.exit(1);
		}

		// Generate training sessions
		const trainingSessions = [];
		for (const program of trainingProgramDocs) {
			for (let i = 0; i < 3; i++) {
				trainingSessions.push({
					Training: program._id, // Match schema field name
					Trainer:
						trainers[Math.floor(Math.random() * trainers.length)]
							._id, // Assign a random trainer
					SessionDate: faker.date.future(),
					SessionTime: `${faker.number.int({ min: 9, max: 17 })}:00`, // Random hour between 9AM-5PM
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
				Employee: user._id, // Match the "Employee" field in the Assignment model
				Training:
					trainingProgramDocs[
						Math.floor(Math.random() * trainingProgramDocs.length)
					]._id,
				AssignedByManager:
					managers[Math.floor(Math.random() * managers.length)]._id, // Assign a random manager
			});
		}
		const assignmentDocs = await Assignment.insertMany(assignments);

		// Enroll users in training sessions
		const enrollments = [];
		for (const user of userDocs) {
			for (let i = 0; i < 2; i++) {
				enrollments.push({
					Employee: user._id, // Match the "Employee" field in the Enrollment model
					Session:
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
				Enrollment: enrollment._id, // Match the "Enrollment" field in the CompletionStatus model
				Trainer:
					trainers[Math.floor(Math.random() * trainers.length)]._id, // Assign a random trainer
				CompletionDate: faker.date.recent(), // Add a recent date for completion
				Status: Math.random() > 0.5 ? "Completed" : "Pending", // Match the "Status" field in the CompletionStatus model
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
