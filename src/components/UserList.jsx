import React from 'react';
import { useAuth } from '../services/AuthProvider.jsx';

const UserList = ({ users, onSelectUser }) => {
  const { user: authUser } = useAuth();

  const filteredUsers = users.filter(user => user.id !== authUser.sub);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id} onClick={() => onSelectUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;