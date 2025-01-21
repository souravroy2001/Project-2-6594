// src/components/Graphs.js

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import axios from 'axios';

const Graphs = () => {
  const [taskData, setTaskData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks.json');
        const tasks = response.data;

        // Process task data for Category Breakdown
        const taskCategories = Object.values(tasks).reduce((acc, task) => {
          const category = task.category || 'Other';
          if (!acc[category]) acc[category] = 0;
          acc[category] += 1;
          return acc;
        }, {});

        const categoryData = Object.keys(taskCategories).map((category) => ({
          category,
          value: taskCategories[category],
        }));

        setTaskData(categoryData);

        // Process task data for Priority Breakdown
        const taskPriorities = Object.values(tasks).reduce((acc, task) => {
          const priority = task.priority || 'Low';
          if (!acc[priority]) acc[priority] = 0;
          acc[priority] += 1;
          return acc;
        }, {});

        const priorityData = Object.keys(taskPriorities).map((priority) => ({
          priority,
          value: taskPriorities[priority],
        }));

        setPriorityData(priorityData);
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Pie Chart: Task Breakdown by Category */}
      <div className="w-full md:w-2/3 mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Task Breakdown by Category</h2>
        <PieResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={taskData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
              {taskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
              ))}
            </Pie>
          </PieChart>
        </PieResponsiveContainer>
      </div>

      {/* Pie Chart: Task Breakdown by Priority */}
      <div className="w-full md:w-2/3 mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Task Breakdown by Priority</h2>
        <PieResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={priorityData} dataKey="value" nameKey="priority" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d">
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff7300' : '#8884d8'} />
              ))}
            </Pie>
          </PieChart>
        </PieResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;
