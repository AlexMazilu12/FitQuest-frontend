import React, { useState, useEffect } from "react";
import { WorkoutService } from "../services/WorkoutService";
import { TextField, Button, Box, Typography } from "@mui/material";

const AddExerciseForm = ({ workoutPlanId, onExerciseAdded, userToken, editingExercise, onExerciseEdited }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(editingExercise ? editingExercise.id : "");
  const [sets, setSets] = useState(editingExercise ? editingExercise.sets : "");
  const [reps, setReps] = useState(editingExercise ? editingExercise.reps : "");
  const [restTime, setRestTime] = useState(editingExercise ? editingExercise.restTime : "");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await WorkoutService.getExercises(userToken);
        setExercises(response);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Error fetching exercises");
      }
    };

    fetchExercises();
  }, [userToken]);

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
        await WorkoutService.updateExerciseInWorkout(workoutPlanId, exerciseData, userToken);
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
    <Box component="form" onSubmit={handleAddExercise} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">{editingExercise ? "Edit Exercise" : "Add Exercise"}</Typography>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <TextField
        select
        label="Select Exercise"
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        SelectProps={{
          native: true,
        }}
        fullWidth
        disabled={!!editingExercise}
      >
        <option value="">Select an exercise</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </TextField>
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingExercise ? "Update Exercise" : "Add Exercise"}
      </Button>
    </Box>
  );
};

export default AddExerciseForm;