
import axios from "axios";
import { toast } from "react-hot-toast";

// Axios response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        // Don't show authentication error for the initial auth check
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/api/users/getuser")
        ) {
            toast.error("Authentication error");
        }

        return Promise.reject(error);
    }
);

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
        // Handle 401 (Unauthorized) or 403 (Forbidden)
        // These are normal when the user is not logged in.
        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {
            return null;
        }

        // Handle network/CORS errors
        if (!error.response) {
            console.warn(
                "Network or CORS issue on initial auth check:",
                error.message
            );
            return null;
        }

        // Prevent the route from crashing
        return null;
    }
};

