import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutService } from "../services/WorkoutService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Grid } from "@mui/material";
import AddExerciseForm from "../components/AddExerciseForm.jsx";

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workout, setWorkout] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchWorkouts();
    }
  }, [isAuthenticated, navigate]);

  const fetchWorkouts = async () => {
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

    try {
      const workoutWithUserId = { ...workout, userId: user.id };

      if (isEditing) {
        await WorkoutService.updateWorkout(editId, workoutWithUserId, user.token);
      } else {
        await WorkoutService.createWorkout(workoutWithUserId, user.token);
      }
      setWorkout({ title: "", description: "" });
      fetchWorkouts();
    } catch (error) {
      console.error("Error saving workout:", error);
      setError("Error saving workout");
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Workout Page
      </Typography>
      {error && (
        <Typography variant="body2" align="center" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={workout.title}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={workout.description}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEditing ? "Update Workout" : "Create Workout"}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {isEditing && (
            <AddExerciseForm workoutPlanId={editId} onExerciseAdded={fetchWorkouts} userToken={user.token} />
          )}
        </Grid>
      </Grid>
      <div>
        {workouts.map((workout) => (
          <Paper key={workout.id} sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h6">{workout.title}</Typography>
            <Typography>{workout.description}</Typography>
            <Button onClick={() => {
              setWorkout({ title: workout.title, description: workout.description });
              setIsEditing(true);
              setEditId(workout.id);
            }}>Edit</Button>
            <Button onClick={async () => {
              try {
                await WorkoutService.deleteWorkout(workout.id, user.token);
                fetchWorkouts();
              } catch (error) {
                console.error("Error deleting workout:", error);
                setError("Error deleting workout");
              }
            }}>Delete</Button>
            <Typography variant="h6">Exercises:</Typography>
            <ul>
              {workout.exercises && workout.exercises.map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
            </ul>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;