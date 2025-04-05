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
			roles.map((name) => ({ roleName: name }))
		);

		// Generate users
		const users = [
			{
				firstName: "John",
				lastName: "Admin",
				username: "admin",
				email: "admin@example.com",
				password: await bcrypt.hash("password", 10),
				role: roleDocs[0]._id, // Admin role
			},
		];
		for (const role of roleDocs) {
			for (let i = 0; i < 11; i++) {
				const hashedPassword = await bcrypt.hash("password123", 10);
				const firstName = faker.person.firstName();
				const lastName = faker.person.lastName();
				users.push({
					firstName: firstName,
					lastName: lastName,
					username: faker.internet.username({
						firstName: firstName,
						lastName: lastName,
					}),
					email: faker.internet.email(),
					password: hashedPassword,
					role: role._id, // Assign the current role
				});
			}
		}
		const userDocs = await User.insertMany(users);

		// Fetch all managers to assign a valid Manager ID
		// Find the Manager role ID
		const managerRole = await Role.findOne({ roleName: "Manager" });

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
		const trainingPrograms = [
			{
				title: "Web Development Fundamentals",
				description:
					"An introduction to building websites using HTML, CSS, and JavaScript.",
			},
			{
				title: "Advanced Algorithms",
				description:
					"Dive deep into advanced algorithmic concepts like dynamic programming and graph theory.",
			},
			{
				title: "Database Management Systems",
				description:
					"Learn about relational databases, SQL, and modern database technologies.",
			},
			{
				title: "Introduction to Artificial Intelligence",
				description:
					"Explore the basics of AI, including machine learning and neural networks.",
			},
			{
				title: "Full-Stack Web Development",
				description:
					"Learn both frontend and backend technologies, including React, Node.js, Express, and MongoDB.",
			},
		].map((program) => ({
			...program,
			manager: managers[Math.floor(Math.random() * managers.length)]._id, // Assign a random manager
			duration: faker.number.int({ min: 1, max: 12 }), // Random duration (weeks/months)
			deadline: faker.date.future(), // Future deadline
		}));

		const trainingProgramDocs = await TrainingProgram.insertMany(
			trainingPrograms
		);

		// Find the Trainer role ID
		const trainerRole = await Role.findOne({ roleName: "Trainer" });

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
				const hour = String(
					faker.number.int({ min: 9, max: 17 })
				).padStart(2, "0");
				const sessionTime = `${hour}:00`;
				trainingSessions.push({
					training: program._id, // Match schema field name
					trainer:
						trainers[Math.floor(Math.random() * trainers.length)]
							._id, // Assign a random trainer
					sessionDate: faker.date.future(),
					sessionTime: sessionTime,
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
				employee: user._id, // Match the "Employee" field in the Assignment model
				training:
					trainingProgramDocs[
						Math.floor(Math.random() * trainingProgramDocs.length)
					]._id,
				assignedByManager:
					managers[Math.floor(Math.random() * managers.length)]._id, // Assign a random manager
			});
		}
		const assignmentDocs = await Assignment.insertMany(assignments);

		// Enroll users in training sessions
		const enrollments = [];
		for (const assignment of assignmentDocs) {
			for (let i = 0; i < 2; i++) {
				enrollments.push({
					assignment: assignment._id, // Match the "Assignment" field in the Enrollment model
					session:
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
				enrollment: enrollment._id, // Match the "Enrollment" field in the CompletionStatus model
				trainer:
					trainers[Math.floor(Math.random() * trainers.length)]._id, // Assign a random trainer
				completionDate: faker.date.recent(), // Add a recent date for completion
				status: Math.random() > 0.5 ? "Completed" : "Pending", // Match the "Status" field in the CompletionStatus model
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
