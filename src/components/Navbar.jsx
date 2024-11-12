import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import logo from "../assets/images/fitquest-logo.png";
import "@fontsource/inter";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="Logo" />
                </a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Workouts</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Trainers</a>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <a className="nav-link text-primary" href="#">Profile</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

