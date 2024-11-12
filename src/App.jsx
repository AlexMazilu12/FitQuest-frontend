import React, { useEffect, useState } from "react";
import { UserService } from "./services/UserService";
import AddUser from "./components/AddUser";
import Navbar from "./components/Navbar";
import "./App.css";
import "@fontsource/inter"

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:8080/users");
            const data = await response.json();
            setUsers(data.users);
        };

        fetchUsers();
    }, []);

    const handleUserAdded = (newUser) => {
        setUsers([...users, newUser]);
    };

    return (
        <div style={{ backgroundColor: '#23242F', height: '100%', width:"100%" }}>
            <Navbar />
            <div className="container mt-5 pt-4">
                <h1>All Users</h1>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name} ({user.email}) - {user.role}
                        </li>
                    ))}
                </ul>

                <h2>Register New User</h2>
                <AddUser onUserAdded={handleUserAdded} />
            </div>
        </div>
    );
}

export default App;
