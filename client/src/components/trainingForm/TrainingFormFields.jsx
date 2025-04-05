import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const TrainingFormFields = ({ form, errors, managers, onChange }) => {
	return (
		<>
			<TextField
				label="Title"
				name="title"
				fullWidth
				value={form.title}
				onChange={onChange}
				error={!!errors.title}
				helperText={errors.title}
			/>
			<TextField
				label="Description"
				name="description"
				fullWidth
				multiline
				rows={4}
				value={form.description}
				onChange={onChange}
				error={!!errors.description}
				helperText={errors.description}
			/>
			<TextField
				label="Duration (weeks)"
				type="number"
				name="duration"
				fullWidth
				value={form.duration}
				onChange={onChange}
				error={!!errors.duration}
				helperText={errors.duration}
			/>
			<DatePicker
				label="Deadline"
				value={form.deadline ? dayjs(form.deadline) : null}
				onChange={(newValue) =>
					onChange({
						target: {
							name: "deadline",
							value: newValue
								? newValue.format("YYYY-MM-DD")
								: "",
						},
					})
				}
				slotProps={{
					textField: {
						fullWidth: true,
						error: !!errors.deadline,
						helperText: errors.deadline,
					},
				}}
			/>
			<TextField
				label="Assign Manager"
				name="manager"
				select
				fullWidth
				value={
					managers.some((m) => m._id === form.manager)
						? form.manager
						: ""
				}
				onChange={onChange}
			>
				<MenuItem value="">
					<em>Unassigned</em>
				</MenuItem>
				{managers.map((m) => (
					<MenuItem key={m._id} value={m._id}>
						{m.firstName} {m.lastName}
					</MenuItem>
				))}
			</TextField>
		</>
	);
};

export default TrainingFormFields;
