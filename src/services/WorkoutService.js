export const WorkoutService = {
  getAllWorkouts: async (token) => {
      const response = await fetch("http://localhost:8080/workouts", {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
      });
      if (!response.ok) {
          throw new Error(`Error fetching workouts: ${response.statusText}`);
      }
      return await response.json();
  },

  createWorkout: async (workout, token) => {
      const response = await fetch("http://localhost:8080/workouts", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workout),
      });
      if (!response.ok) {
          throw new Error(`Error creating workout: ${response.statusText}`);
          
      }
      return await response.json();
  },

  updateWorkout: async (id, workout, token) => {
    const response = await fetch(`http://localhost:8080/workouts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
    });
    if (!response.ok) {
        throw new Error(`Error updating workout: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return { message: "Workout updated successfully" };
},


deleteWorkout: async (id, token) => {
  const response = await fetch(`http://localhost:8080/workouts/${id}`, {
      method: "DELETE",
      headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
      },
  });

  if (!response.ok) {
      throw new Error(`Error deleting workout: ${response.statusText}`);
  }

  // Check if the response has a JSON body
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
      return await response.json();
  }

  // Return a default success message or handle as needed
  return { message: "Workout deleted successfully" };
  },

  getExercises: async (token) => {
    const response = await fetch("http://localhost:8080/exercises", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching exercises: ${response.statusText}`);
    }
    return await response.json();
  },

  addExerciseToWorkout: async (workoutId, exercise, token) => {
    const response = await fetch(`http://localhost:8080/workouts/${workoutId}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error(`Error adding exercise to workout: ${response.statusText}`);
    }
    return await response.json();
  },

  getExercisesForWorkout: async (workoutPlanId, token) => {
    const response = await fetch(`http://localhost:8080/workouts/${workoutPlanId}/exercises`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching exercises for workout: ${response.statusText}`);
    }
    return await response.json();
  },

  updateExerciseInWorkout: async (workoutPlanId, exerciseId, exerciseData, token) => {
    console.log(`Updating exercise in workout: workoutPlanId=${workoutPlanId}, exerciseId=${exerciseId}, exerciseData=${JSON.stringify(exerciseData)}`);
    const response = await fetch(`http://localhost:8080/workouts/${workoutPlanId}/exercises/${exerciseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exerciseData),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error updating exercise in workout: ${errorMessage}`);
    }
    return await response.json();
  },
  
};
