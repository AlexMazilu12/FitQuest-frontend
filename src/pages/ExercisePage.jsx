import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExerciseService } from "../services/ExerciseService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", description: "", muscleGroup: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!authUser || authUser.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchExercises();
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchExercises = async () => {
    try {
      const response = await ExerciseService.getAllExercises(authUser.token);
      console.log("Response from getAllExercises:", response); // Log the response for debugging
      if (response && Array.isArray(response)) {
        setExercises(response);
      } else {
        setExercises([]);
        console.error("Expected an array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExercise({ ...exercise, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await ExerciseService.updateExercise(editId, exercise, authUser.token);
      } else {
        await ExerciseService.addExercise(exercise, authUser.token);
      }
      fetchExercises();
      setExercise({ name: "", description: "", muscleGroup: "" });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Error saving exercise");
    }
  };

  const handleEdit = (exercise) => {
    setExercise(exercise);
    setIsEditing(true);
    setEditId(exercise.id);
  };

  const handleCancelEdit = () => {
    setExercise({ name: "", description: "", muscleGroup: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      await ExerciseService.deleteExercise(id, authUser.token);
      fetchExercises();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const formatMuscleGroup = (muscleGroup) => {
    return muscleGroup.charAt(0) + muscleGroup.slice(1).toLowerCase();
  };

  return (
    <Box>
      <Typography variant="h4">Exercises</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={exercise.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={exercise.description}
          onChange={handleInputChange}
          required
        />
        <FormControl required>
          <InputLabel>Muscle Group</InputLabel>
          <Select
            name="muscleGroup"
            value={exercise.muscleGroup}
            onChange={handleInputChange}
          >
            <MenuItem value="CHEST">Chest</MenuItem>
            <MenuItem value="BACK">Back</MenuItem>
            <MenuItem value="LEGS">Legs</MenuItem>
            <MenuItem value="ARMS">Arms</MenuItem>
            <MenuItem value="SHOULDERS">Shoulders</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit">{isEditing ? "Update" : "Add"} Exercise</Button>
        {isEditing && <Button onClick={handleCancelEdit}>Cancel</Button>}
      </form>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Muscle Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>{formatMuscleGroup(exercise.muscleGroup)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(exercise)}>Edit</Button>
                  <Button onClick={() => handleDelete(exercise.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExercisesPage;