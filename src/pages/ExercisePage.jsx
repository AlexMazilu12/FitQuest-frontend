import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExerciseService } from "../services/ExerciseService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Modal } from "@mui/material";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", description: "", muscleGroup: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Error saving exercise");
    }
  };

  const handleEdit = (exercise) => {
    setExercise(exercise);
    setIsEditing(true);
    setEditId(exercise.id);
    setOpen(true);
  };

  const handleCancelEdit = () => {
    setExercise({ name: "", description: "", muscleGroup: "" });
    setIsEditing(false);
    setEditId(null);
    setOpen(false);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" gutterBottom>
        Exercises
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', padding: '12px 24px' }}>
        Add Exercise
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            {isEditing ? "Update Exercise" : "Create Exercise"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={exercise.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={exercise.description}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <FormControl required fullWidth>
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
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Update Exercise" : "Create Exercise"}
            </Button>
            {isEditing && <Button onClick={handleCancelEdit} variant="outlined" color="secondary">Cancel</Button>}
          </Box>
        </Box>
      </Modal>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
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
                  <Button onClick={() => handleEdit(exercise)} variant="contained" color="primary" sx={{ mr: 2 }}>Edit</Button>
                  <Button onClick={() => handleDelete(exercise.id)} variant="contained" sx={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
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