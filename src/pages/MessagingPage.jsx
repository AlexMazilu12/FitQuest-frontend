import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { useAuth } from '../services/AuthProvider.jsx';
import UserList from '../components/UserList';
import MessageForm from '../components/MessageForm';
import ReceivedMessages from '../components/ReceivedMessages';
import NavBar from '../components/NavBar';

const MessagingPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers(authUser.token);
      if (response && Array.isArray(response.users)) {
        const filteredUsers = response.users.filter(user => user.id !== authUser.userId);
        setUsers(filteredUsers);
      } else {
        console.error('Fetched data is not an array:', response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <UserList users={users} onSelectUser={setSelectedUser} />
      {selectedUser && <MessageForm selectedUser={selectedUser} />}
      <ReceivedMessages />
    </div>
  );
};

export default MessagingPage;