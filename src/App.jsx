import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import WorkoutPage from "./pages/WorkoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider} from "./services/AuthProvider.jsx";
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
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
