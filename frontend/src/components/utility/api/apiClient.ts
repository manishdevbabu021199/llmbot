import { APIConstants } from "@/app/api.constants";
import axios from "axios";

// API Base URL
const API_BASE_URL = APIConstants.END_POINT;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
        const token: any = JSON.parse(localStorage.getItem("user"));
        if (token) {
      config.headers["Authorization"] = `Bearer ${token["id_token"]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Token Expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken : any = JSON.parse(localStorage.getItem("user"));
        if (!refreshToken.refresh_token) throw new Error("No refresh token available");

        // Refresh Token API Call
        const refreshResponse = await axios.post(APIConstants.REFRESH_TOKEN, {
          refresh_token: refreshToken.refresh_token,
        });

        const newIdToken = refreshResponse.data;
        localStorage.setItem("id_token", newIdToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newIdToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
