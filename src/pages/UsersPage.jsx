import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { useAuth } from "../services/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", role: "USER" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
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
      const response = await UserService.getAllUsers(authUser.token);
      console.log("Response from getAllUsers:", response); // Log the response for debugging
      if (response && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
        console.error("Expected an array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setUser({ name: "", email: "", role: "USER" });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Error saving user");
    }
  };

  const handleEdit = (user) => {
    setUser(user);
    setIsEditing(true);
    setEditId(user.id);
  };

  const handleCancelEdit = () => {
    setUser({ name: "", email: "", role: "USER" });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Box>
      <Typography variant="h4">Users</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          required
        />
        <FormControl required>
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
        <Button type="submit">{isEditing ? "Update" : "Add"} User</Button>
        {isEditing && <Button onClick={handleCancelEdit}>Cancel</Button>}
      </form>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
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
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
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