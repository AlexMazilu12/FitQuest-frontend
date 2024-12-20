import React, { useState } from "react";
import { Button, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { UserService } from "../services/UserService";
import { useAuth } from "../services/AuthProvider.jsx";

const AddUser = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });
  const { user: authUser } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await UserService.addUser(formData, authUser.token);
      onUserAdded();
      setFormData({ name: "", email: "", password: "", role: "USER" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Add User</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <FormControl required>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="TRAINER">TRAINER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit">Add User</Button>
      </form>
    </Box>
  );
};

export default AddUser;