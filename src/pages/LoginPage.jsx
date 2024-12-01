import { useState } from "react";
import { Button, Box, Typography, Paper, TextField } from "@mui/material";
import NavBar from "../components/NavBar";
import loginImage from "../assets/images/fitquest-logo.jpg";
import axios from "axios";
import { useAuth } from "../services/AuthProvider.jsx";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/auth/login",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            login(response.data.accessToken);
            navigate('/');
        } catch (err) {
            setError(err.response.data.errors[0].error === "INVALID_CREDENTIALS" ? "Invalid credentials" : "An error occurred");
        }
    };

    return (
        <>
            <NavBar />
                <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start", // Aligns to the left
            paddingLeft: "37vw", // Optional: Adjust this value to fine-tune position
            minHeight: "100vh",
            overflow: "hidden", // Removes scrollbar
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
                width: "1000px",
                maxWidth: 400,
            }}
        >
            <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={loginImage} alt="Authenticate" style={{ width: "200px" }} />
            </div>
            <Typography variant="h4" align="center" gutterBottom>
                Login to FitQuest
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Login
                </Button>
                <Typography align="center">
                    Haven't registered yet? <Link to="/register">Register here</Link>
                </Typography>
            </Box>
        </Paper>
    </Box>
        </>
    );
};

export default LoginPage;