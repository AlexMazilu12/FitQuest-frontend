import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutService } from "../services/WorkoutService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Grid, Modal } from "@mui/material";
import AddExerciseForm from "../components/AddExerciseForm.jsx";

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workout, setWorkout] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [exerciseForms, setExerciseForms] = useState({});
  const [open, setOpen] = useState(false);
  const [addingExerciseToWorkoutId, setAddingExerciseToWorkoutId] = useState(null);
  const [openExerciseModal, setOpenExerciseModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user && user.userId) {
      fetchWorkouts();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchWorkouts = async () => {
    if (!user || !user.token) return;
    try {
      const response = await WorkoutService.getAllWorkouts(user.token);
      if (response && Array.isArray(response.workoutPlans)) {
        const workoutsWithExercises = await Promise.all(
          response.workoutPlans.map(async (workout) => {
            const exercises = await WorkoutService.getExercisesForWorkout(workout.id, user.token);
            return { ...workout, exercises: exercises.exercises };
          })
        );
        setWorkouts(workoutsWithExercises);
      } else {
        setWorkouts([]);
        console.error("Expected an array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setError("Error fetching workouts");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user || !user.userId) {
      setError("User ID is not available. Please try again.");
      return;
    }

    try {
      const workoutWithUserId = { ...workout, userId: user.userId };

      if (isEditing) {
        await WorkoutService.updateWorkout(editId, workoutWithUserId, user.token);
      } else {
        await WorkoutService.createWorkout(workoutWithUserId, user.token);
      }
      setWorkout({ title: "", description: "" });
      setIsEditing(false);
      setEditId(null);
      setOpen(false);
      fetchWorkouts();
    } catch (error) {
      console.error("Error saving workout:", error);
      setError("Error saving workout");
    }
  };

  const handleEditExercise = (workoutId, exercise) => {
    setEditingExerciseId(`${workoutId}-${exercise.id}`);
    setExerciseForms((prevForms) => ({
      ...prevForms,
      [`${workoutId}-${exercise.id}`]: { sets: exercise.sets, reps: exercise.reps, restTime: exercise.restTime }
    }));
    setEditId(workoutId);
  };

  const handleExerciseChange = (workoutId, exerciseId, e) => {
    const { name, value } = e.target;
    setExerciseForms((prevForms) => ({
      ...prevForms,
      [`${workoutId}-${exerciseId}`]: { ...prevForms[`${workoutId}-${exerciseId}`], [name]: value }
    }));
  };

  const handleSaveExercise = async (workoutId, exerciseId) => {
    if (!user || !user.token) return;
    try {
      const exerciseForm = { ...exerciseForms[`${workoutId}-${exerciseId}`], id: exerciseId };
      await WorkoutService.updateExerciseInWorkout(workoutId, exerciseId, exerciseForm, user.token);
      setEditingExerciseId(null);
      fetchWorkouts();
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Error saving exercise");
    }
  };

  const handleDeleteExercise = async (workoutId, exerciseId) => {
    if (!user || !user.token) return;
    try {
      await WorkoutService.deleteExerciseFromWorkout(workoutId, exerciseId, user.token);
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      setError("Error deleting exercise");
    }
  };

  const resetFormStates = () => {
    setWorkout({ title: "", description: "" });
    setIsEditing(false);
    setEditId(null);
    setEditingExerciseId(null);
    setExerciseForms({});
    setAddingExerciseToWorkoutId(null);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetFormStates();
    setOpen(false);
  };

  const handleOpenExerciseModal = () => setOpenExerciseModal(true);
  const handleCloseExerciseModal = () => {
    setAddingExerciseToWorkoutId(null);
    setOpenExerciseModal(false);
  };

  return (
    <Box sx={{ padding: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Workout Page
      </Typography>
      {error && (
        <Typography variant="body2" align="center" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={2} justifyContent="center" sx={{ flexGrow: 1 }}>
        {workouts.map((workout) => (
          <Grid item xs={12} sm={6} md={4} key={workout.id}>
            <Paper sx={{ padding: 2, margin: 2, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{workout.title}</Typography>
                <Typography>{workout.description}</Typography>
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    if (isEditing && editId === workout.id) {
                      resetFormStates();
                    } else {
                      setWorkout({ title: workout.title, description: workout.description });
                      setIsEditing(true);
                      setEditId(workout.id);
                      handleOpen();
                    }
                  }}
                  style={{ backgroundColor: 'green', color: 'white', marginRight: '8px' }} // Set edit button color to green and add margin
                >
                  {isEditing && editId === workout.id ? "Cancel Edit" : "Edit"}
                </Button>
                <Button
                  onClick={async () => {
                    if (!user || !user.token) return;
                    try {
                      await WorkoutService.deleteWorkout(workout.id, user.token);
                      fetchWorkouts();
                    } catch (error) {
                      console.error("Error deleting workout:", error);
                      setError("Error deleting workout");
                    }
                  }}
                  style={{ backgroundColor: 'red', color: 'white' }} // Set delete button color to red
                >
                  Delete
                </Button>
              </Box>
              <Box>
                <Typography variant="h6">Exercises:</Typography>
                <ul>
                  {workout.exercises && workout.exercises.map((exercise) => (
                    <li key={exercise.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                        {editingExerciseId === `${workout.id}-${exercise.id}` ? (
                          <div>
                            <TextField
                              label="Sets"
                              name="sets"
                              value={exerciseForms[`${workout.id}-${exercise.id}`]?.sets || ""}
                              onChange={(e) => handleExerciseChange(workout.id, exercise.id, e)}
                            />
                            <TextField
                              label="Reps"
                              name="reps"
                              value={exerciseForms[`${workout.id}-${exercise.id}`]?.reps || ""}
                              onChange={(e) => handleExerciseChange(workout.id, exercise.id, e)}
                            />
                            <TextField
                              label="Rest Time"
                              name="restTime"
                              value={exerciseForms[`${workout.id}-${exercise.id}`]?.restTime || ""}
                              onChange={(e) => handleExerciseChange(workout.id, exercise.id, e)}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 1 }}>
                              <Button onClick={() => handleSaveExercise(workout.id, exercise.id)} style={{ backgroundColor: '#1EA896', color: 'white', marginRight: '8px' }}>
                                Confirm
                              </Button>
                              <Button onClick={() => setEditingExerciseId(null)} style={{ backgroundColor: 'red', color: 'white' }}>
                                Cancel
                              </Button>
                            </Box>
                          </div>
                        ) : (
                          <div>
                            {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Rest Time: {exercise.restTime} seconds
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 1 }}>
                              <Button onClick={() => handleEditExercise(workout.id, exercise)} style={{ backgroundColor: 'green', color: 'white', marginRight: '8px' }}>
                                Edit
                              </Button>
                              <Button onClick={() => handleDeleteExercise(workout.id, exercise.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                                Delete
                              </Button>
                            </Box>
                          </div>
                        )}
                      </Box>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => {
                    setAddingExerciseToWorkoutId(workout.id);
                    handleOpenExerciseModal();
                  }}
                  style={{ backgroundColor: '#1EA896', color: 'white' }} // Set add exercise button color to green
                >
                  {addingExerciseToWorkoutId === workout.id ? "Cancel" : "Add Exercise"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ backgroundColor: '#1EA896', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', padding: '12px 24px' }}>
              Add Workout
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            {isEditing ? "Update Workout" : "Create Workout"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={workout.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={workout.description}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ backgroundColor: '#1EA896', color: 'white' }}>
              {isEditing ? "Update Workout" : "Create Workout"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openExerciseModal} onClose={handleCloseExerciseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <AddExerciseForm
            workoutPlanId={addingExerciseToWorkoutId}
            onExerciseAdded={() => {
              fetchWorkouts();
              handleCloseExerciseModal();
            }}
            userToken={user?.token}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default WorkoutPage;