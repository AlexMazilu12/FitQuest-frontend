import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../services/AuthProvider.jsx';

const ReceivedMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/notifications/received', {
          headers: {
            Authorization: `Bearer ${authUser.token}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (authUser) {
        fetchMessages();
      }
    }, [authUser]); 

  return (
    <div>
      <h2>Received Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>From:</strong> {message.from} <br />
            <strong>Message:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
                    
export default ReceivedMessages;