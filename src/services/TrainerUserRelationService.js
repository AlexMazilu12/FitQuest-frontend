import axios from 'axios';

const API_URL = "http://localhost:8080";

export const TrainerUserRelationService = {
  createRelation: async (token, relationData) => {
    const response = await axios.post(`${API_URL}/api/user-trainer-relations`, relationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    });
    return response.data;
  },
  getClients: async (token, trainerId) => {
    const response = await axios.get(`${API_URL}/api/user-trainer-relations/trainer/${trainerId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
    });
    return response.data;
  },
  deleteRelation: async (token, trainerId, userId) => {
    const response = await axios.delete(`${API_URL}/api/user-trainer-relations/trainer/${trainerId}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
    });
    return response.data;
  },
};