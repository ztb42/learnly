import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5050";

const useApi = (endpoint) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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

	return { data, loading, error };
};

export default useApi;
