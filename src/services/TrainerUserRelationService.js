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
};