import axios from 'axios';

export const UserService = {
  getAllUsers: async (token) => {
    const response = await axios.get('/users/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Ensure this is an object with a users array
  },
  addUser: async (user, token) => {
    const response = await axios.post('/users', user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  updateUser: async (id, user, token) => {
    const response = await axios.put(`/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  deleteUser: async (id, token) => {
    const response = await axios.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};