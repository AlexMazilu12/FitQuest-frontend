import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutService } from "../services/WorkoutService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";

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
        setWorkouts(response.workoutPlans);
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isEditing ? "Update Workout" : "Create Workout"}
        </Button>
      </Box>
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
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;