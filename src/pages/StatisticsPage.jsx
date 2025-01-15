import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { StatisticsService } from '../services/StatisticsService';
import { useAuth } from '../services/AuthProvider.jsx';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState([]);
  const [workoutsPerMonth, setWorkoutsPerMonth] = useState([]);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!authUser || authUser.role !== "ADMIN") {
      navigate("/unauthorized");
    } else {
      fetchStatistics(authUser.token);
      fetchWorkoutsPerMonth(authUser.token, authUser.userId);
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

  const fetchWorkoutsPerMonth = async (token, userId) => {
    try {
      const data = await StatisticsService.getWorkoutsPerMonth(token, userId);
      if (Array.isArray(data)) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const transformedData = data.map(item => ({
          ...item,
          month: monthNames[item.month - 1]
        }));
        setWorkoutsPerMonth(transformedData);
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error fetching workouts per month:', error);
    }
  };

  const totalAverage = statistics.reduce((sum, stat) => sum + stat.averageExercisesPerWorkout, 0) / statistics.length;

  const topStatistics = statistics
    .sort((a, b) => b.averageExercisesPerWorkout - a.averageExercisesPerWorkout)
    .slice(0, 10);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box sx={{ paddingTop: '80px', paddingX: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Statistics
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Average Exercises per Workout: {totalAverage.toFixed(2)}
      </Typography>
      <BarChart
        width={600}
        height={300}
        data={topStatistics}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="userName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="averageExercisesPerWorkout" fill="#8884d8" />
      </BarChart>
      <Typography variant="h6" gutterBottom>
        Workouts Per Month
      </Typography>
      {workoutsPerMonth.length > 0 ? (
        <PieChart width={400} height={400}>
        <Pie
          data={workoutsPerMonth}
          dataKey="count"
          nameKey="month"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {workoutsPerMonth.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    ) : (
      <Typography variant="body1">No workout data available for this month.</Typography>
    )}
    </Box>
  );
};

export default StatisticsPage;