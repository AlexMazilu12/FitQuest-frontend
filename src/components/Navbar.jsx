import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import logo from "../assets/images/fitquest-logo.png";
import "@fontsource/inter";
import { useAuth } from "../services/AuthProvider.jsx";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && user.role === "ADMIN" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/exercises">Exercises</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainers">Trainers</Link>
                </li>
                {isAuthenticated && user.role === "TRAINER" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/trainer-bookings">My Bookings</Link>
                  </li>
                )}
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/messaging">Messaging</Link>
            </li>
          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <>
                <Link className="nav-link text-primary" to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
                <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link className="nav-link text-primary" to="/login">Authenticate</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;