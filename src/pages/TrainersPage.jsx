import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { BookingService } from "../services/BookingService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Alert, Card, CardContent, CardActions, Button, TextField } from "@mui/material";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchTrainers();
      fetchBookings();
    }
  }, [isAuthenticated, navigate]);

  const fetchTrainers = async () => {
    try {
      const response = await UserService.getTrainers(user.token);
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

  const fetchBookings = async () => {
    try {
      const response = await BookingService.getUserBookings(user.token, user.userId);
      setBookings(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(`Error fetching bookings: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleBook = async (trainer) => {
    try {
      const bookingRequest = {
        userId: user.userId,
        userName: user.sub,
        trainerId: trainer.id,
        message: message,
        createdAt: new Date().toISOString(),
      };
      await BookingService.createBookingRequest(user.token, bookingRequest);
      alert("Booking request created successfully!");
      setMessage("");
      fetchBookings(); // Refresh bookings after creating a new one
    } catch (error) {
      console.error("Error creating booking request:", error);
      setError(`Error creating booking request: ${error.response?.data?.message || error.message}`);
    }
  };

  const hasBookingWithTrainer = (trainerId) => {
    return bookings.some(booking => booking.trainerId === trainerId);
  };

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
            <Card sx={{ width: '100%', backgroundColor: 'white', color: 'blue' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'blue' }}>{trainer.name}</Typography>
                <Typography variant="body2" sx={{ color: 'blue' }}>{trainer.email}</Typography>
              </CardContent>
              <CardActions sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                {!hasBookingWithTrainer(trainer.id) && (
                  <>
                    <Button
                      size="small"
                      onClick={() => handleBook(trainer)}
                      sx={{
                        backgroundColor: 'blue',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '2px solid blue',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        marginBottom: '8px',
                      }}
                    >
                      Book
                    </Button>
                    <TextField
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      sx={{ marginTop: 1, width: '100%', backgroundColor: 'white', color: 'blue' }}
                    />
                  </>
                )}
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TrainersPage;