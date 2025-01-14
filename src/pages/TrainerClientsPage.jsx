import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrainerUserRelationService } from "../services/TrainerUserRelationService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Card, CardContent, CardActions, Button, Alert, Box } from "@mui/material";

const TrainerClientsPage = () => {
  const [clients, setClients] = useState([]);
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
    }
  }, [isAuthenticated, user, navigate]);

  const fetchClients = async () => {
    try {
      const response = await TrainerUserRelationService.getClients(user.token, user.userId);
      setClients(response);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(`Error fetching clients: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDisband = async (clientId) => {
    try {
      console.log(`Attempting to disband client with id: ${clientId}`);
      await TrainerUserRelationService.deleteRelation(user.token, user.userId, clientId);
      alert("Client disbanded!");
      fetchClients();
    } catch (error) {
      console.error("Error disbanding client:", error);
      setError(`Error disbanding client: ${error.response?.data?.message || error.message}`);
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
              </CardContent>
              <CardActions>
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