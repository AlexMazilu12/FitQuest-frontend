import axios from 'axios';

const API_URL = 'http://localhost:8080/workouts';

export const WorkoutService = {
  getAllWorkouts(title = null) {
    const params = title ? { title } : {};
    return axios
      .get(API_URL, { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching workouts:", error);
        throw error;
      });
  },

  createWorkout(workout) {
    const workoutWithUserId = { ...workout, userId: 1 };
    return axios
      .post(API_URL, workoutWithUserId)
      .then(response => response.data)
      .catch(error => {
        console.error("Error creating workout:", error);
        throw error;
      });
    },

  updateWorkout(id, workout) {
    return axios
      .put(`${API_URL}/${id}`, workout)
      .then(response => response.data)
      .catch(error => {
        console.error("Error updating workout:", error);
        throw error;
      });
  },

  deleteWorkout(id) {
    return axios
      .delete(`${API_URL}/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error deleting workout:", error);
        throw error;
      });
  },
};
