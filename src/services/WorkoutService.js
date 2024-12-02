import axios from 'axios';

const API_URL = 'http://localhost:8080/workouts';

const getAuthHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const WorkoutService = {
  getAllWorkouts(token, title = null) {
    const params = title ? { title } : {};
    return axios
      .get(API_URL, { ...getAuthHeaders(token), params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching workouts:", error);
        throw error;
      });
  },

  createWorkout(workout, token) {
    return axios
      .post(API_URL, workout, getAuthHeaders(token))
      .then(response => response.data)
      .catch(error => {
        console.error("Error creating workout:", error);
        throw error;
      });
  },

  updateWorkout(id, workout, token) {
    return axios
      .put(`${API_URL}/${id}`, workout, getAuthHeaders(token))
      .then(response => response.data)
      .catch(error => {
        console.error("Error updating workout:", error);
        throw error;
      });
  },

  deleteWorkout(id, token) {
    return axios
      .delete(`${API_URL}/${id}`, getAuthHeaders(token))
      .then(response => response.data)
      .catch(error => {
        console.error("Error deleting workout:", error);
        throw error;
      });
  },
};