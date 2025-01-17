import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrainerUserRelationService } from "../services/TrainerUserRelationService";
import { WorkoutService } from "../services/WorkoutService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Card, CardContent, CardActions, Button, Alert, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TrainerClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [assignedWorkouts, setAssignedWorkouts] = useState({});
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!user || user.role !== "TRAINER") {
      navigate("/unauthorized");
    } else {
      fetchClients();
      fetchWorkouts();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchClients = async () => {
    try {
      const response = await TrainerUserRelationService.getClients(user.token, user.userId);
      setClients(response);
      fetchAssignedWorkouts(response);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(`Error fetching clients: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await WorkoutService.getAllWorkouts(user.token, user.userId);
      setWorkouts(response.workoutPlans);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setError(`Error fetching workouts: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchAssignedWorkouts = async (clients) => {
    try {
      const assignedWorkoutsData = {};
      for (const client of clients) {
        const response = await WorkoutService.getAssignedWorkouts(user.token, client.id);
        assignedWorkoutsData[client.id] = response.workoutPlans;
      }
      setAssignedWorkouts(assignedWorkoutsData);
    } catch (error) {
      console.error("Error fetching assigned workouts:", error);
      setError(`Error fetching assigned workouts: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDisband = async (clientId) => {
    try {
      await TrainerUserRelationService.deleteRelation(user.token, user.userId, clientId);
      setClients(clients.filter(client => client.id !== clientId));
      setAssignedWorkouts(prev => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
    } catch (error) {
      console.error("Error disbanding client:", error);
      setError(`Error disbanding client: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleAssignWorkout = async (clientId) => {
    try {
      const response = await WorkoutService.assignWorkoutToClient(selectedWorkout, clientId, user.token);
      if (response.status === 409) {
        alert(response.data.message);
      } else {
        alert("Workout assigned to client!");
        await fetchAssignedWorkouts(clients);
        setSelectedWorkout("");
      }
    } catch (error) {
      console.error("Error assigning workout to client:", error);
      setError(`Error assigning workout to client: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Clients
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {Array.isArray(clients) && clients.map((client) => (
          <ListItem key={client.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">Client: {client.name}</Typography>
                <Typography variant="body2">Email: {client.email}</Typography>
                <Typography variant="body2">Assigned Workouts:</Typography>
                <ul>
                  {assignedWorkouts[client.id]?.map((workout) => (
                    <li key={workout.id}>{workout.title}</li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <FormControl fullWidth>
                  <InputLabel>Assign Workout</InputLabel>
                  <Select
                    value={selectedWorkout}
                    onChange={(e) => setSelectedWorkout(e.target.value)}
                  >
                    {workouts
                      .filter(workout => !assignedWorkouts[client.id]?.some(assigned => assigned.id === workout.id))
                      .map((workout) => (
                        <MenuItem key={workout.id} value={workout.id}>
                          {workout.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAssignWorkout(client.id)}
                  disabled={assignedWorkouts[client.id]?.some((workout) => workout.id === selectedWorkout)}
                  sx={{
                    backgroundColor: '#1EA896',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid #1EA896',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    marginBottom: '8px',
                  }}
                >
                  Assign
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDisband(client.id)}
                  sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid red',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    marginBottom: '8px',
                  }}
                >
                  Disband
                </Button>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TrainerClientsPage;