import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../services/AuthProvider.jsx";

const TrainersPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <NavBar />
      <div className="container" style={{ marginTop: "-350px" }} >
        <h1>Trainers Page</h1>
        {isAuthenticated && user.role === "USER" ? (
          <p>Welcome!</p>
        ) : (
          <p>This page is unaccesible by trainers!</p>
          
        )}
      </div>
    </>
  );
};

export default TrainersPage;