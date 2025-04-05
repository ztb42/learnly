import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const useApi = (endpoint, fetchOnMount = true) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(fetchOnMount); // Only set loading if fetchOnMount is true
	const [error, setError] = useState(null);

	// Fetch data (GET request)
	const fetchData = useCallback(async () => {
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
	}, [endpoint]);

	// Initial fetch when hook is mounted if fetchOnMount is true
	useEffect(() => {
		if (fetchOnMount) {
			fetchData();
		}
	}, [fetchOnMount, fetchData]);

	// Function to refetch data manually
	const refetch = async () => {
		await fetchData();
	};

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
			setData((prevData) => prevData.filter((item) => item._id !== id));
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	};

	// Function to edit (update) an item
	const editItem = async (updatedData, id) => {
		try {
			const url = id
				? `${BASE_URL}${endpoint}/${id}`
				: `${BASE_URL}${endpoint}`;
			const response = await axios.put(url, updatedData);

			// Optionally update the local state after editing
			setData((prevData) =>
				prevData.map((item) => (item._id === id ? response.data : item))
			);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	};

	return { data, loading, error, postItem, deleteItem, editItem, refetch };
};

export default useApi;
