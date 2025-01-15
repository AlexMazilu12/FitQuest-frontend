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
  getWorkoutsPerMonth: async (token, userId) => {
    try {
      const response = await axios.get(`${API_URL}/workouts-per-month`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts per month:', error);
      return [];
    }
  },
};