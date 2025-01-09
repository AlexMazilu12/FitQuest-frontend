import React, { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Alert, Card, CardContent, CardActions, Button } from "@mui/material";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await UserService.getTrainers(user.token);
        console.log("Response from server:", response); // Log the response
        if (response && Array.isArray(response.users)) {
          const filteredTrainers = response.users.filter(trainer => trainer.role === "TRAINER");
          setTrainers(filteredTrainers);
        } else {
          setTrainers([]);
          console.error("Expected an array but got:", response);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setError(`Error fetching trainers: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchTrainers();
  }, [user.token]);

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Trainers
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {Array.isArray(trainers) && trainers.map((trainer) => (
          <ListItem key={trainer.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">{trainer.name}</Typography>
                <Typography variant="body2" color="textSecondary">{trainer.email}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Book</Button>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TrainersPage;