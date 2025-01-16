export const WorkoutService = {
  getAllWorkouts: async (token, userId) => {
    const response = await fetch(`http://localhost:8080/workouts?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
      },
  });

  if (!response.ok) {
      throw new Error(`Error deleting workout: ${response.statusText}`);
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
      return await response.json();
  }

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
    try {
      console.log(`Adding exercise to workout: workoutId=${workoutId}, exercise=${JSON.stringify(exercise)}`);
      console.log(`Authorization token: ${token}`);
      const response = await fetch(`http://localhost:8080/workouts/${workoutId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workoutPlanId: workoutId,
          exercise: {
            id: exercise.id,
          },
          sets: parseInt(exercise.sets, 10),
          reps: parseInt(exercise.reps, 10),
          restTime: parseInt(exercise.restTime, 10),
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding exercise to workout: ${errorMessage}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in addExerciseToWorkout:", error);
      throw error;
    }
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

  deleteExerciseFromWorkout: async (workoutPlanId, exerciseId, token) => {
    const response = await fetch(`http://localhost:8080/workouts/${workoutPlanId}/exercises/${exerciseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting exercise from workout: ${response.statusText}`);
    }

    return { message: "Exercise deleted successfully" };
  },

  assignWorkoutToClient: async (workoutId, clientId, token) => {
    const response = await fetch(`http://localhost:8080/workouts/${workoutId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workoutId, userId: clientId }),
    });
    if (!response.ok) {
      throw new Error(`Error assigning workout to client: ${response.statusText}`);
    }
    return await response.json();
  },
  
  getAssignedWorkouts: async (token, clientId) => {
    const response = await fetch(`http://localhost:8080/workouts?userId=${clientId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching assigned workouts: ${response.statusText}`);
    }
    return await response.json();
  },
};