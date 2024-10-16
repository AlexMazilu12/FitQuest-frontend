import React, { useEffect, useState } from "react";
import { UserService } from "./services/UserService";
import AddUser from "./components/AddUser";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
      // Fetch all users when the component loads
      const fetchUsers = async () => {
          const response = await fetch("http://localhost:8080/users");
          const data = await response.json();
          setUsers(data.users); // Assuming the response structure is { users: [...] }
      };

      fetchUsers();
  }, []);

  // Callback to add new user to the list
  const handleUserAdded = (newUser) => {
      setUsers([...users, newUser]); // Add the new user to the existing users array
  };

  return (
      <div>
          <h1>All Users</h1>
          <ul>
              {users.map((user) => (
                  <li key={user.id}>
                      {user.name} ({user.email}) - {user.role}
                  </li>
              ))}
          </ul>

          <h2>Add New User</h2>
          <AddUser onUserAdded={handleUserAdded} />
      </div>
  );
}

export default App;