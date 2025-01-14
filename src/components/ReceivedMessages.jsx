import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../services/AuthProvider.jsx';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

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
    <Paper sx={{ padding: 2, height: '100%', overflowY: 'auto', backgroundColor: '#2C2F33' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Received Messages
      </Typography>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id} sx={{ color: 'white' }}>
            <ListItemText
              primary={`From: ${message.from}`}
              secondary={`Message: ${message.text}`}
              sx={{ color: 'white' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ReceivedMessages;