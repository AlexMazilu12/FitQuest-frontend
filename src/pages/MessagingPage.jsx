import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { useAuth } from '../services/AuthProvider.jsx';
import { Typography, Box, Grid, Paper } from '@mui/material';
import UserList from '../components/UserList';
import MessageForm from '../components/MessageForm';
import ReceivedMessages from '../components/ReceivedMessages';
import NavBar from '../components/NavBar';

const MessagingPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (authUser && authUser.token) {
      fetchUsers();
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchUsers = async () => {
    if (!authUser || !authUser.token) return;
    try {
      const response = await UserService.getAllUsers(authUser.token);
      if (response && Array.isArray(response.users)) {
        const filteredUsers = response.users.filter(user => user.id !== authUser.userId);
        setUsers(filteredUsers);
      } else {
        console.error('Fetched data is not an array:', response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <Box sx={{ paddingTop: '80px'}}>
      <NavBar />
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
          Messaging Page
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <UserList users={users} onSelectUser={setSelectedUser} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#2C2F33' }}>
              {selectedUser ? (
                <>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Messages with {selectedUser.name}
                  </Typography>
                  <Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2 }}>
                    <ReceivedMessages selectedUser={selectedUser} />
                  </Box>
                  <MessageForm selectedUser={selectedUser} />
                </>
              ) : (
                <Typography variant="h6" align="center" color="textSecondary" sx={{ color: 'white' }}>
                  Select a user to start messaging
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MessagingPage;