import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import WorkoutPage from "./pages/WorkoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider} from "./services/AuthProvider.jsx";
import TrainersPage from "./pages/TrainersPage.jsx";
import TrainerBookingsPage from "./pages/TrainerBookingsPage.jsx";
import TrainerClientsPage from "./pages/TrainerClientsPage.jsx";
import ExercisePage from "./pages/ExercisePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import MessagingPage from "./pages/MessagingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import "./App.css";
import "@fontsource/inter";

function App() {
    return (
        <div style={{ backgroundColor: '#23242F', height: '100%', width: "100%" }}>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <div className="container mt-5 pt-4">
                        <Routes>
                            <Route path="/" element={<h1>Welcome to the Workout App</h1>} />
                            <Route path="/workouts" element={<WorkoutPage />} />
                            <Route path="/trainers" element={<TrainersPage />} />
                            <Route path="/trainer-bookings" element={<TrainerBookingsPage />} />
                            <Route path="/trainer-clients" element={<TrainerClientsPage />} />
                            <Route path="/exercises" element={<ExercisePage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/messaging" element={<MessagingPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
