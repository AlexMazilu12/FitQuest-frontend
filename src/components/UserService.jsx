import axios from 'axios';

export const UserService = {
  getAllUsers: async (token) => {
    const response = await axios.get('/users/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Ensure this is an array
  }
};