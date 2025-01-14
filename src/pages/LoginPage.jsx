import { useState, useEffect } from "react";
import { Button, Box, Typography, Paper, TextField } from "@mui/material";
import NavBar from "../components/NavBar";
import loginImage from "../assets/images/fitquest-logo.jpg";
import axios from "axios";
import { useAuth } from "../services/AuthProvider.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:8080/auth/login",
                { email: data.email, password: data.password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            login(response.data.accessToken);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === 'INVALID_CREDENTIALS') {
                setError('Invalid credentials');
            } else {
                setError('An unexpected error occurred');
            }
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
                        noValidate // Disable browser's built-in validation
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email ? (errors.email.type === 'pattern' ? 'Email is invalid' : 'Email is required') : ''}
                            {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password ? (errors.password.type === 'minLength' ? 'Password must be at least 4 characters' : 'Password is required') : ''}
                            {...register("password", { required: true, minLength: 4 })}
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