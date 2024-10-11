import React, { useEffect, useState } from "react";
import { UserService } from "./services/UserService";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError(false);
    UserService.getAllUsers()
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container">
      <h1>User List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Failed to load users. Please try again.</p>}
      {!loading && !error && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      )}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}
    </div>
  );
}

export default App;