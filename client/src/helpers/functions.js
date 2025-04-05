export const formatTime = (time) => {
	return time
		? new Date(`1970-01-01T${time}Z`).toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
		  })
		: "Not set";
};
