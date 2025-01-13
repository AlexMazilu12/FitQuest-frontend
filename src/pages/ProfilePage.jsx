import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthProvider.jsx';
import { UserService } from '../services/UserService';
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';
import NavBar from '../components/NavBar';
import '../App.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUser();
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchUser = async () => {
    try {
      if (authUser && authUser.id) {
        const userData = await UserService.getUser(authUser.id, authUser.token);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '',
          role: userData.role,
        });
      } else {
        console.error('User ID is undefined');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Updating user with ID: ${authUser.id}`);
      console.log(`Token: ${authUser.token}`);
      console.log(`User data:`, formData);
      await UserService.updateUser(authUser.id, formData, authUser.token);
      await fetchUser();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Error updating user data: ' + error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Box>
      <NavBar />
      <Container 
      maxWidth="sm" 
      style={{ 
        padding: '2rem', 
        marginTop: '2rem', 
        position: 'absolute',
        top: '150px',
        left: '450px',
      }}
    >
        <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem'}}>
          <Typography variant="h4" align="center" gutterBottom>
            User Details
          </Typography>
          {editMode ? (
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Save
              </Button>
            </form>
          ) : (
            <div>
              <Typography variant="h6" gutterBottom>
                Name: {user.name}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Email: {user.email}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Role: {user.role}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)} fullWidth style={{ backgroundColor: '#1EA896'}}>
                Edit
              </Button >
            </div>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;