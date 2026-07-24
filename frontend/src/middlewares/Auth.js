import axios from "axios";
export const authenticateUser = async () => {
  try {
        const response = await axios.get("http://localhost:3000/api/users/getuser", {
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
