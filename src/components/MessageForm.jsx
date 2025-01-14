import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../services/AuthProvider.jsx';
import { Box, TextField, Button, Typography } from '@mui/material';

const MessageForm = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { user: authUser } = useAuth();

  const sendMessage = () => {
    if (!selectedUser || !selectedUser.email) {
      console.error('Selected user is invalid:', selectedUser);
      setStatus('Failed to send message. Invalid recipient.');
      return;
    }

    axios.post('/notifications/send', {
      id: new Date().getTime().toString(), // Generate a unique ID for the message
      from: authUser.sub, // Use the email of the sender
      to: selectedUser.email, // Use the email of the recipient
      text: message
    }, {
      headers: {
        Authorization: `Bearer ${authUser.token}`
      }
    })
    .then(() => {
      setMessage('');
      setStatus('Message sent successfully!');
    })
    .catch(error => {
      console.error('Error sending message:', error);
      setStatus('Failed to send message.');
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Send Message to {selectedUser.name}
      </Typography>
      <TextField
        label="Type a message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        sx={{ mb: 2, backgroundColor: 'white' }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
      {status && <Typography variant="body2" color="textSecondary" sx={{ mt: 2, color: 'white' }}>{status}</Typography>}
    </Box>
  );
};

export default MessageForm;