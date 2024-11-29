import axios from 'axios';

export const UserService = {
  getAllUsers(name = null) {
    const params = name ? { name } : {};
    return axios.get('http://localhost:8080/users', { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;
      });
  }
};