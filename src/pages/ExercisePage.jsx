import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ExerciseService } from "../services/ExerciseService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Modal } from "@mui/material";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [search, setSearch] = useState("");
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!authUser || authUser.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchExercises();
    }
  }, [isAuthenticated, authUser, navigate, filterMuscleGroup, orderBy, direction, search]);

  const fetchExercises = async () => {
    try {
      const response = await ExerciseService.getAllExercises(authUser.token, filterMuscleGroup, orderBy, direction, search);
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

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await ExerciseService.updateExercise(editId, data, authUser.token);
      } else {
        await ExerciseService.addExercise(data, authUser.token);
      }
      fetchExercises();
      reset();
      setIsEditing(false);
      setEditId(null);
      setOpen(false);
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Error saving exercise");
    }
  };

  const handleEdit = (exercise) => {
    reset(exercise);
    setIsEditing(true);
    setEditId(exercise.id);
    setOpen(true);
  };

  const handleCancelEdit = () => {
    reset();
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
    return muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1).toLowerCase();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" gutterBottom>
        Exercises
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'white' }}>Muscle Group</InputLabel>
          <Select
            sx={{ color: 'white' }}
            value={filterMuscleGroup}
            onChange={(e) => setFilterMuscleGroup(e.target.value)}
            data-cy="input-muscleGroup"
          >
            <MenuItem value="" data-cy="select-option-all">All</MenuItem>
            <MenuItem value="CHEST" data-cy="select-option-CHEST">Chest</MenuItem>
            <MenuItem value="BACK" data-cy="select-option-BACK">Back</MenuItem>
            <MenuItem value="LEGS" data-cy="select-option-LEGS">Legs</MenuItem>
            <MenuItem value="ARMS" data-cy="select-option-ARMS">Arms</MenuItem>
            <MenuItem value="SHOULDERS" data-cy="select-option-SHOULDERS">Shoulders</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel sx={{ color: 'white' }}>Order By</InputLabel>
          <Select
            sx={{ color: 'white' }}
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            data-cy="input-orderBy"
          >
            <MenuItem value="name" data-cy="select-option-name">Name</MenuItem>
            <MenuItem value="createdAt" data-cy="select-option-createdAt">Creation Date</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel sx={{ color: 'white' }}>Direction</InputLabel>
          <Select
            sx={{ color: 'white' }}
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            data-cy="input-direction"
          >
            <MenuItem value="asc" data-cy="select-option-asc">Ascending</MenuItem>
            <MenuItem value="desc" data-cy="select-option-desc">Descending</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            style: { color: 'white' },
          }}
          data-cy="input-search"
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', padding: '12px 24px' }}>
        Add Exercise
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            {isEditing ? "Update Exercise" : "Create Exercise"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              {...register("name", { required: "Name cannot be blank" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              data-cy="input-name"
            />
            <TextField
              label="Description"
              {...register("description", { required: "Description cannot be blank" })}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              data-cy="input-description"
            />
            <FormControl required fullWidth>
              <InputLabel>Muscle Group</InputLabel>
              <Controller
                name="muscleGroup"
                control={control}
                defaultValue=""
                rules={{ required: "Muscle Group cannot be blank" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    error={!!errors.muscleGroup}
                    data-cy="input-muscleGroupedit"
                  >
                    <MenuItem value="CHEST" data-cy="select-option-CHESTedit">Chest</MenuItem>
                    <MenuItem value="BACK" data-cy="select-option-BACKedit">Back</MenuItem>
                    <MenuItem value="LEGS" data-cy="select-option-LEGSedit">Legs</MenuItem>
                    <MenuItem value="ARMS" data-cy="select-option-ARMSedit">Arms</MenuItem>
                    <MenuItem value="SHOULDERS" data-cy="select-option-SHOULDERSedit">Shoulders</MenuItem>
                  </Select>
                )}
              />
              {errors.muscleGroup && <Typography color="error">{errors.muscleGroup.message}</Typography>}
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