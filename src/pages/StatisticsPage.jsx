import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StatisticsPage = ({ statistics }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Statistics
      </Typography>
      <Paper>
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
    </Container>
  );
};

export default StatisticsPage;