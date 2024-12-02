import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExerciseService } from "../services/ExerciseService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!user || user.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchExercises();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchExercises = async () => {
    try {
      const response = await ExerciseService.getAllExercises(user.token);
      if (response && Array.isArray(response)) {
        setExercises(response);
      } else {
        setExercises([]);
        console.error("Expected an array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Error fetching exercises");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise({ ...exercise, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const exerciseWithUserId = { ...exercise, userId: user.id };

      if (isEditing) {
        await ExerciseService.updateExercise(editId, exerciseWithUserId, user.token);
      } else {
        await ExerciseService.createExercise(exerciseWithUserId, user.token);
      }
      setExercise({ title: "", description: "" });
      fetchExercises();
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Error saving exercise");
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Exercise Page
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
          value={exercise.title}
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
          value={exercise.description}
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
          {isEditing ? "Update Exercise" : "Create Exercise"}
        </Button>
      </Box>
      <div>
        {exercises.map((exercise) => (
          <Paper key={exercise.id} sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h6">{exercise.title}</Typography>
            <Typography>{exercise.description}</Typography>
            <Button onClick={() => {
              setExercise({ title: exercise.title, description: exercise.description });
              setIsEditing(true);
              setEditId(exercise.id);
            }}>Edit</Button>
            <Button onClick={async () => {
              try {
                await ExerciseService.deleteExercise(exercise.id, user.token);
                fetchExercises();
              } catch (error) {
                console.error("Error deleting exercise:", error);
                setError("Error deleting exercise");
              }
            }}>Delete</Button>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;