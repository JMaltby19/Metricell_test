import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../src/App.css";

export const EmployeeList = () => {
	const [employees, setEmployees] = useState([]);
	const [name, setName] = useState("");
	const [value, setValue] = useState("");
	const [updateName, setUpdateName] = useState("");
	const [updateValue, setUpdateValue] = useState("");
	const [pageNumber, setPageNumber] = useState(0);

	const employeesPerPage = 10;
	const pagesVisited = pageNumber * employeesPerPage;

	const displayEmployees = employees
		.slice(pagesVisited, pagesVisited + employeesPerPage)
		.map((employee) => {
			return (
				<tr key={employee.name} className="table">
					<td className="tableData">{employee.name}</td>
					<td className="tableData">{employee.value}</td>
					<td className="tableData">
						<button onClick={() => handleDelete(employee.name)}>Delete</button>
					</td>
				</tr>
			);
		});

	// use effect hook to retrieve the list of employees from the API when the component mounts
	useEffect(() => {
		fetchEmployees();
	}, [employees]);

	const fetchEmployees = async () => {
		try {
			const response = await axios.get("/List/GetEmployee");
			setEmployees(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	// handle form submission to add a new employee
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/List/AddEmployee", { name, value });
			setEmployees([...employees, response.data]);
			setName("");
			setValue("");
		} catch (error) {
			console.error(error);
		}
	};

	// handle click event to delete an employee
	const handleDelete = async (name) => {
		try {
			await axios.delete(`/List/DeleteEmployee/${name}`);
			setEmployees(employees.filter((employee) => employee.name !== name));
		} catch (error) {
			console.error(error);
		}
	};

	const updateEmployee = async () => {
		try {
			const result = await axios.put("/List/PutEmployee", {
				name: updateName,
				value: parseInt(updateValue),
			});
			console.log(result);
			setEmployees([...employees, result.data]);
			setUpdateName("");
			setUpdateValue("");
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		const employee = { Name: setUpdateName, Value: setUpdateValue };

		updateEmployee(employee);
	};

	const getSums = async () => {
		try {
			const response = await axios.get("/List/SumList");
			let msg = "";
			response.data.map(({ y, x }) => {
				msg += y + " is the total value for " + x + ".\n";
			});
			alert(msg);
		} catch (error) {
			console.log(error.message);
		}
	};

	const increment = async () => {
		try {
			await axios.get("List/Increment");
			fetchEmployees();
		} catch (error) {
			console.log(error.message);
		}
	};

	const pageCount = Math.ceil(employees.length / employeesPerPage);

	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	return (
		<div className="container">
			<form className="container__form" onSubmit={handleSubmit}>
				<label htmlFor="name">Name:</label>
				<input
					className="container__input"
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<label htmlFor="value">Value:</label>
				<input
					className="container__input"
					type="number"
					id="value"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button type="submit">Add Employee</button>
			</form>
			<form className="container__form" onSubmit={handleUpdate}>
				<label htmlFor="name">Name:</label>
				<input
					className="container__input"
					type="text"
					value={updateName}
					onChange={(e) => setUpdateName(e.target.value)}
				/>
				<label htmlFor="value">Value:</label>
				<input
					className="container__input"
					type="number"
					value={updateValue}
					onChange={(e) => setUpdateValue(e.target.value)}
				/>
				<button type="submit">Update Employee</button>
			</form>
			<div className="container__btnGroup">
				<button className="container__btns" onClick={() => getSums()}>
					Get sums
				</button>
				<button className="container__btns" onClick={() => increment()}>
					Increment
				</button>
			</div>
			<div className="container__table">
				<h1 className="table__header">Employee List</h1>
				<table className="table__details">
					<thead>
						<tr className="table__rows">
							<th className="table__heading">Name</th>
							<th className="table__heading">Value</th>
							<th className="table__heading">Actions</th>
						</tr>
					</thead>
					<tbody className="table__body">{displayEmployees}</tbody>
					<ReactPaginate
						previousLabel={"Previous"}
						nextLabel={"Next"}
						pageCount={pageCount}
						onPageChange={changePage}
						containerClassName={"paginationBtns"}
						previousLinkClassName={"previousBtn"}
						nextLinkClassName={"nextBtn"}
						disabledLinkClassName={"paginationDisabled"}
						activeClassName={"paginationActive"}
					/>
				</table>
			</div>
		</div>
	);
};
