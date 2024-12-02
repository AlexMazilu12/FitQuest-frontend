import { useState } from "react";
import { Button, Box, Typography, Paper, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import NavBar from "../components/NavBar";
import registerImage from "../assets/images/fitquest-logo.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider.jsx";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    if (isAuthenticated) {
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/auth/register", { name, email, password, role });
            setSuccess("Registration successful! Logging you in...");

            login(response.data.accessToken);

            navigate("/");
        } catch (err) {
            console.error("Error registering or logging in:", err.response?.data || err.message);
            setError(err.response?.data?.message || "An error occurred during registration.");
        }
    };

    return (
        <>
            <NavBar />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    paddingTop: "275px",
                    paddingLeft: "37vw",
                    overflow: "auto",
                    
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        width: "100%",
                        maxWidth: 400,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src={registerImage} alt="Register" style={{ width: "200px" }} />
                    </div>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register for MindEase
                    </Typography>
                    {error && (
                        <Typography
                            variant="body2"
                            align="center"
                            color="error"
                            sx={{ marginBottom: 2 }}
                        >
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography
                            variant="body2"
                            align="center"
                            color="success"
                            sx={{ marginBottom: 2 }}
                        >
                            {success}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            label="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                label="Role"
                            >
                                <MenuItem value="USER">User</MenuItem>
                                <MenuItem value="TRAINER">Trainer</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Register
                        </Button>
                        <Typography>
                            Already registered? <Link to="/login">Login here</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default RegisterPage;