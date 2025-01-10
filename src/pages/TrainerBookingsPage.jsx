import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../services/BookingService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Typography, List, ListItem, Card, CardContent, CardActions, Button, Alert } from "@mui/material";

const TrainerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "TRAINER") {
      navigate("/login");
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, user.role, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await BookingService.getTrainerBookings(user.token, user.userId);
      setBookings(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(`Error fetching bookings: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await BookingService.approveBooking(user.token, bookingId);
      alert("Booking approved successfully!");
      fetchBookings(); // Refresh bookings after approval
    } catch (error) {
      console.error("Error approving booking:", error);
      setError(`Error approving booking: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
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
              </CardContent>
              <CardActions>
                {!booking.approved && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleApprove(booking.id)}
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
    </div>
  );
};

export default TrainerBookingsPage;