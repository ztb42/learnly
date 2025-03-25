import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5050";

const useApi = (endpoint) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch data (GET request)
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await axios.get(`${BASE_URL}${endpoint}`);
				setData(response.data); // Axios automatically parses JSON
			} catch (err) {
				setError(err.response?.data?.message || err.message); // Handle errors gracefully
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [endpoint]);

	// Function to delete an item
	const deleteItem = async (id) => {
		try {
			await axios.delete(`${BASE_URL}${endpoint}/${id}`);
			// Optionally update the local state after deletion
			setData((prevData) => prevData.filter((item) => item.id !== id));
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	};

	// Function to edit (update) an item
	const editItem = async (id, updatedData) => {
		try {
			const response = await axios.put(
				`${BASE_URL}${endpoint}/${id}`,
				updatedData
			);
			// Optionally update the local state after editing
			setData((prevData) =>
				prevData.map((item) => (item.id === id ? response.data : item))
			);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	};

	return { data, loading, error, deleteItem, editItem };
};

export default useApi;
