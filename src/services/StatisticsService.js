import axios from "axios";

const API_URL = "http://localhost:8080/api/statistics";

export const StatisticsService = {
  getWorkoutPlanCountsByUserWithDetails: async (token) => {
    const response = await axios.get(`${API_URL}/user-averages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};