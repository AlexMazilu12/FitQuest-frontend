import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../services/BookingService";
import { TrainerUserRelationService } from "../services/TrainerUserRelationService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Card, CardContent, CardActions, Button, Alert, TextField, Box } from "@mui/material";

const TrainerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!user || user.role !== "TRAINER") {
      navigate("/unauthorized");
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await BookingService.getTrainerBookings(user.token, user.userId);
      setBookings(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(`Error fetching bookings: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleApprove = async (booking, price) => {
    try {
      if (!price) {
        throw new Error("Price is missing in the booking request.");
      }

      await TrainerUserRelationService.createRelation(user.token, {
        trainerId: user.userId,
        userId: booking.userId,
        price: price
      });

      await BookingService.deleteBooking(user.token, booking.id);

      alert("Booking approved!");
      fetchBookings();
    } catch (error) {
      console.error("Error approving booking:", error);
      console.error("Error response:", error.response);
      setError(`Error approving booking: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Bookings
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {Array.isArray(bookings) && bookings.map((booking) => (
          <ListItem key={booking.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">Booking from: {booking.userName}</Typography>
                <Typography variant="body2">Message: {booking.message}</Typography>
                <Typography variant="body2">Date: {new Date(booking.createdAt).toLocaleString()}</Typography>
                <TextField
                  label="Price"
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: 2 }}
                  onChange={(e) => booking.price = e.target.value}
                />
              </CardContent>
              <CardActions>
                {!booking.approved && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleApprove(booking, booking.price)}
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
                    Approve
                  </Button>
                )}
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TrainerBookingsPage;