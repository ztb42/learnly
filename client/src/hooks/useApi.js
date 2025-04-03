import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const useApi = (endpoint, fetchOnMount = true) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(fetchOnMount); // Only set loading if fetchOnMount is true
	const [error, setError] = useState(null);

	// Fetch data (GET request)
	useEffect(() => {
		if (!fetchOnMount) return; // Skip the GET request if fetchOnMount is false

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
	}, [endpoint, fetchOnMount]);

	// Function to create (add) an item
	const postItem = async (newData) => {
		try {
			const response = await axios.post(
				`${BASE_URL}${endpoint}`,
				newData
			);
			// Optionally update the local state after creation
			setData((prevData) => [...prevData, response.data]);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			throw err.response?.data?.message || err.message; // Re-throw error for the caller to handle
		}
	};

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

	return { data, loading, error, postItem, deleteItem, editItem };
};

export default useApi;
