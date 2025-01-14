import React from 'react';
import { List, ListItem, ListItemText, Divider, Paper, Typography } from '@mui/material';

const UserList = ({ users, onSelectUser }) => {
  if (!users) return null;

  return (
    <Paper sx={{ padding: 2, height: '100%', backgroundColor: '#2C2F33' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Users
      </Typography>
      <List>
        {users.map(user => (
          <React.Fragment key={user.id}>
            <ListItem button onClick={() => onSelectUser(user)} sx={{ backgroundColor: '#3B3E51', color: 'white', '&:hover': { backgroundColor: '#4B4E61' } }}>
              <ListItemText primary={user.name} secondary={user.email} sx={{ color: 'white' }} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default UserList;