import React, { useState, useEffect } from "react";
import { WorkoutService } from "../services/WorkoutService";
import { TextField, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";

const AddExerciseForm = ({ workoutPlanId, onExerciseAdded, userToken, editingExercise, onExerciseEdited }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(editingExercise ? editingExercise.id : "");
  const [sets, setSets] = useState(editingExercise ? editingExercise.sets : "");
  const [reps, setReps] = useState(editingExercise ? editingExercise.reps : "");
  const [restTime, setRestTime] = useState(editingExercise ? editingExercise.restTime : "");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

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

  const handleAddExercise = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const exerciseData = {
        id: selectedExercise,
        sets,
        reps,
        restTime,
      };

      if (editingExercise) {
        await WorkoutService.updateExerciseInWorkout(workoutPlanId, selectedExercise, exerciseData, userToken);
        onExerciseEdited();
      } else {
        await WorkoutService.addExerciseToWorkout(workoutPlanId, exerciseData, userToken);
        onExerciseAdded();
      }

      setSelectedExercise("");
      setSets("");
      setReps("");
      setRestTime("");
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
    <Box component="form" onSubmit={handleAddExercise} sx={{ flexGrow: 1, width: '100%' }}>
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
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Rest Time (seconds)"
            type="number"
            value={restTime}
            onChange={(e) => setRestTime(e.target.value)}
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
                  <TableCell>Exercise Name</TableCell>
                </TableRow>
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