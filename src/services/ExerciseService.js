export const ExerciseService = {
  getAllExercises: async (token, muscleGroup, orderBy, direction, search) => {
    const params = new URLSearchParams({
      muscleGroup: muscleGroup || "",
      orderBy: orderBy || "name",
      direction: direction || "asc",
      search: search || "",
    }).toString();

    const response = await fetch(`http://localhost:8080/exercises?${params}`, {
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

  addExercise: async (exercise, token) => {
    const response = await fetch("http://localhost:8080/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error(`Error creating exercise: ${response.statusText}`);
    }
    return await response.json();
  },

  updateExercise: async (id, exercise, token) => {
    const response = await fetch(`http://localhost:8080/exercises/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error(`Error updating exercise: ${response.statusText}`);
    }
    return await response.json();
  },

  deleteExercise: async (id, token) => {
    const response = await fetch(`http://localhost:8080/exercises/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting exercise: ${response.statusText}`);
    }
  },
};