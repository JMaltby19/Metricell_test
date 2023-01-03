import React, { useState } from "react";
import axios from "axios";

export const UpdateEmployee = ({ name, value, onUpdate, fetchEmployees }) => {
	const [updatedName, setUpdatedName] = useState(name);
	const [updatedValue, setUpdatedValue] = useState(value);

	// const handleUpdate = () => {
	// 	onUpdate({ name: updatedName, value: updatedValue });
	// };

	const updateEmployee = async (name, { value }) => {
		try {
			onUpdate({ name: name, value: parseInt(value) });
			await axios.put("/List/PutEmployee");
			// console.log(result);
			fetchEmployees();
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			<label>
				Name:
				<input
					type="text"
					value={updatedName}
					onChange={(e) => setUpdatedName(e.target.value)}
				/>
			</label>
			<br />
			<label>
				Value:
				<input
					type="text"
					value={updatedValue}
					onChange={(e) => setUpdatedValue(e.target.value)}
				/>
			</label>
			<br />
			<button onClick={updateEmployee}>Update</button>
		</div>
	);
};
