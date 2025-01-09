import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import { WorkoutService } from '../services/WorkoutService';

const AddExerciseForm = ({ workoutPlanId, onExerciseAdded, userToken }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [restTime, setRestTime] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await WorkoutService.getExercises(userToken);
        setExercises(response);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, [userToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      exercise: { id: selectedExercise },
      sets: parseInt(sets),
      reps: parseInt(reps),
      restTime: restTime ? parseInt(restTime) : null
    };

    try {
      await WorkoutService.addExerciseToWorkout(workoutPlanId, requestBody, userToken);
      onExerciseAdded();
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        select
        label="Exercise"
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        required
        fullWidth
      >
        {exercises.map((exercise) => (
          <MenuItem key={exercise.id} value={exercise.id}>
            {exercise.name}
          </MenuItem>
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
        Add Exercise
      </Button>
    </Box>
  );
};

export default AddExerciseForm;