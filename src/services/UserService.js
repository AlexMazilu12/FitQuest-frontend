import axios from "axios";

const API_URL = "http://localhost:8080/users";

export const UserService = {
  getAllUsers: async (token) => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  addUser: async (user, token) => {
    const response = await axios.post(API_URL, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  updateUser: async (id, user, token) => {
    const response = await axios.put(`${API_URL}/${id}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  deleteUser: async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getTrainers: async (token) => {
    const response = await axios.get(`${API_URL}/trainers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getUser: async (id, token) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};