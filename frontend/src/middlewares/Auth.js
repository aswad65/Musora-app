import axios from "axios";
export const authenticateUser = async () => {
  try {
        const response = await axios.get("https://musora-app-production.up.railway.app/api/users/getuser", {
            withCredentials: true,
        });

        return response.data.message;
    } catch (error) {
        if (error.response?.status === 401) {
            return null;
        }

        throw error; // Re-throw unexpected errors
    }
}
