import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { WorkoutService } from "../services/WorkoutService";
import { TextField, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";

const AddExerciseForm = ({ workoutPlanId, onExerciseAdded, userToken, editingExercise, onExerciseEdited }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(editingExercise ? editingExercise.id : "");
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      sets: editingExercise ? editingExercise.sets : "",
      reps: editingExercise ? editingExercise.reps : "",
      restTime: editingExercise ? editingExercise.restTime : "",
    }
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await WorkoutService.getExercises(userToken);
        setExercises(response);
        setFilteredExercises(response);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Error fetching exercises");
      }
    };

    fetchExercises();
  }, [userToken]);

  useEffect(() => {
    setFilteredExercises(
      exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (muscleGroup ? exercise.muscleGroup.toLowerCase() === muscleGroup.toLowerCase() : true)
      )
    );
  }, [searchTerm, muscleGroup, exercises]);

  const onSubmit = async (data) => {
    if (!selectedExercise) {
      setError("Please select an exercise");
      return;
    }

    const exerciseData = {
      id: selectedExercise,
      sets: data.sets,
      reps: data.reps,
      restTime: data.restTime,
    };

    try {
      if (editingExercise) {
        await WorkoutService.updateExerciseInWorkout(workoutPlanId, selectedExercise, exerciseData, userToken);
        onExerciseEdited();
      } else {
        await WorkoutService.addExerciseToWorkout(workoutPlanId, exerciseData, userToken);
        onExerciseAdded();
      }

      reset();
      setSelectedExercise("");
      setError(null);
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
      if (error.response && error.response.status === 409) {
        setError("Exercise is already in the workout");
      } else {
        setError("Error adding exercise to workout");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flexGrow: 1, width: '100%' }}>
      <Typography variant="h6">{editingExercise ? "Edit Exercise" : "Add Exercise"}</Typography>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Sets"
            type="number"
            {...register("sets", { required: "Sets must be at least 1", min: { value: 1, message: "Sets must be at least 1" } })}
            error={!!errors.sets}
            helperText={errors.sets?.message}
            fullWidth
          />
          <TextField
            label="Reps"
            type="number"
            {...register("reps", { required: "Reps must be at least 1", min: { value: 1, message: "Reps must be at least 1" } })}
            error={!!errors.reps}
            helperText={errors.reps?.message}
            fullWidth
          />
          <TextField
            label="Rest Time (seconds)"
            type="number"
            {...register("restTime", { required: "Rest Time must be at least 1", min: { value: 1, message: "Rest Time must be at least 1" } })}
            error={!!errors.restTime}
            helperText={errors.restTime?.message}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ backgroundColor: '#1EA896', color: 'white' }}>
            {editingExercise ? "Update Exercise" : "Add Exercise"}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search Exercises"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Muscle Group</InputLabel>
            <Select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Chest">Chest</MenuItem>
              <MenuItem value="Back">Back</MenuItem>
              <MenuItem value="Legs">Legs</MenuItem>
              <MenuItem value="Arms">Arms</MenuItem>
              <MenuItem value="Shoulders">Shoulders</MenuItem>
              <MenuItem value="Abs">Abs</MenuItem>
            </Select>
          </FormControl>
          <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                <TableCell sx={{ color: 'black !important' }}>Exercise Name</TableCell>                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExercises.map((exercise) => (
                  <TableRow
                    key={exercise.id}
                    hover
                    selected={exercise.id === selectedExercise}
                    onClick={() => setSelectedExercise(exercise.id)}
                    style={{ cursor: "pointer", backgroundColor: exercise.id === selectedExercise ? '#002c9d' : 'inherit' }}
                  >
                    <TableCell style={{ color: exercise.id === selectedExercise ? 'white' : 'inherit' }}>{exercise.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddExerciseForm;