import axios from "axios";

export const authenticateUser = async () => {
    try {
        const response = await axios.get("https://musora-app-production.up.railway.app/api/users/getuser", {
            withCredentials: true,
        });

        return response.data.message;
    } catch (error) {
        // Handle 401 (Unauthorized) or 403 (Forbidden) for unauthenticated users
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }

        // Handle network/CORS errors when cookies/headers aren't set yet
        if (!error.response) {
            console.warn("Network or CORS issue on initial auth check:", error.message);
            return null;
        }

        // Return null instead of crashing the route for initial visitors
        return null;
    }
};