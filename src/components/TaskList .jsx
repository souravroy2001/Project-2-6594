// TaskList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  Grid,
} from "@chakra-ui/react";
import { DNA } from "react-loader-spinner";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks.json"
        );

        // Transform the response into an array of tasks
        const tasksArray = [];
        for (let id in response.data) {
          tasksArray.push({ id, ...response.data[id] });
        }

        setTasks(tasksArray);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={5}>
        <AlertIcon />
        <AlertTitle>{`Error: ${error}`}</AlertTitle>
      </Alert>
    );
  }

  return (
    <Box mt={180} width={"100%"} h={"100%"} p={5}>
      <Grid spacing={4} gridTemplateColumns={"repeat(3, 1fr)"} gap={5}>
        {tasks.map((task) => (
          <Box
            key={task.id}
            borderWidth="1px"
            borderRadius="md"
            p={5}
            boxShadow="md"
          >
            <HStack spacing={4} justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                {task.task}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {task.status}
              </Text>
            </HStack>
            <Text mt={2} fontSize="md">
              <b>Category:</b> {task.category}
            </Text>
            <Text fontSize="md">
              <b>Priority:</b> {task.priority}
            </Text>
            <Text fontSize="md">
              <b>Creator:</b> {task.creator}
            </Text>
            <Text fontSize="md">
              <b>Description:</b> {task.description}
            </Text>
            <Text fontSize="md">
              <b>Time Taken:</b> {task.timeTaken} hours
            </Text>
            <Text fontSize="md">
              <b>Assigned to:</b> {task.employees.join(", ")}
            </Text>
          </Box>
        ))}
      </Grid>

      <Box h={50}></Box>
    </Box>
  );
};

export default TaskList;
