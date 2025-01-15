import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StatisticsService } from '../services/StatisticsService';
import { useAuth } from '../services/AuthProvider.jsx';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState([]);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!authUser || authUser.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchStatistics(authUser.token);
    }
  }, [isAuthenticated, authUser, navigate]);

  const fetchStatistics = async (token) => {
    try {
      const data = await StatisticsService.getWorkoutPlanCountsByUserWithDetails(token);
      if (Array.isArray(data)) {
        setStatistics(data);
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Statistics
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Average Exercise Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map(stat => (
              <TableRow key={stat.id}>
                <TableCell>{stat.id}</TableCell>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.averageExerciseCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <BarChart
        width={600}
        height={300}
        data={statistics}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="averageExerciseCount" fill="#8884d8" />
      </BarChart>
    </Box>
  );
};

export default StatisticsPage;