import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
	RoleName: { type: String, required: true, unique: true },
});

const Role = mongoose.model("Role", RoleSchema);
export default Role;
