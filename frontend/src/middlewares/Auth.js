import axios from "axios";

export const authenticateUser = async () => {
    try {
        const response = await axios.get(
            "https://musora-app-production.up.railway.app/api/users/getuser",
            {
                withCredentials: true,
            }
        );

        return response.data.message;
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }

        if (!error.response) {
            console.warn(
                "Network or CORS issue on initial auth check:",
                error.message
            );
            return null;
        }

        return null;
    }
};
