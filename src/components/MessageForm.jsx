import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../services/AuthProvider.jsx';

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
    <div>
      <h2>Send Message to {selectedUser.name}</h2>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default MessageForm;