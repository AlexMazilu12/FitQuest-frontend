// src/pages/UsersPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Modal } from "@mui/material";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "USER" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!authUser || authUser.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users with token:", authUser.token); // Debugging: Log the token
      const response = await UserService.getAllUsers(authUser.token);
      console.log("Response from getAllUsers:", response); // Debugging: Log the response
      if (response && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
        console.error("Expected an array but got:", response);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - redirecting to login"); // Debugging: Log unauthorized access
        navigate("/login");
      } else {
        console.error("Error fetching users:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (e) => {
    setUser({ ...user, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await UserService.updateUser(editId, user, authUser.token);
      } else {
        await UserService.addUser(user, authUser.token);
      }
      fetchUsers();
      setUser({ name: "", email: "", password: "", role: "USER" });
      setIsEditing(false);
      setEditId(null);
      setOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Error saving user");
    }
  };

  const handleEdit = (user) => {
    setUser(user);
    setIsEditing(true);
    setEditId(user.id);
    setOpen(true);
  };

  const handleCancelEdit = () => {
    setUser({ name: "", email: "", password: "", role: "USER" });
    setIsEditing(false);
    setEditId(null);
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id, authUser.token);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', padding: '12px 24px' }}>
        Add User
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            {isEditing ? "Update User" : "Create User"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <FormControl required fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={user.role}
                onChange={handleRoleChange}
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="TRAINER">TRAINER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Update User" : "Create User"}
            </Button>
            {isEditing && <Button onClick={handleCancelEdit} variant="outlined" color="secondary">Cancel</Button>}
          </Box>
        </Box>
      </Modal>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user)} variant="contained" color="primary" sx={{ mr: 2 }}>Edit</Button>
                  <Button onClick={() => handleDelete(user.id)} variant="contained" sx={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersPage;