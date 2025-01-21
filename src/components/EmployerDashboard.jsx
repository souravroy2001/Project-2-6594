import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Container,
  VStack,
  Text,
  Flex,
  useBreakpointValue,
  Heading,
} from "@chakra-ui/react";
import { Chart } from "chart.js/auto";

const DynamicEmployeeTableWithGraph = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Example data for employees
  const employeeData = [
    {
      name: "John Doe",
      task: "Task A",
      type: "Bug",
      priority: "High",
      status: "Completed",
      timeTaken: 5,
      timeAllotted: 7,
    },
    {
      name: "Jane Smith",
      task: "Task B",
      type: "Feature",
      priority: "Medium",
      status: "In Progress",
      timeTaken: 3,
      timeAllotted: 5,
    },
    {
      name: "Mark Lee",
      task: "Task C",
      type: "Bug",
      priority: "Low",
      status: "Pending",
      timeTaken: 6,
      timeAllotted: 4,
    },
    // More data...
  ];

  // Update status based on time comparison
  const updateStatus = (employee) => {
    if (employee.timeTaken > employee.timeAllotted) {
      return "Overdue";
    } else if (employee.status === "Completed") {
      return "Completed";
    } else {
      return employee.status;
    }
  };

  // Filter employees based on selected filters
  const filteredEmployees = employeeData
    .map((employee) => ({
      ...employee,
      status: updateStatus(employee), // Update the status based on time comparison
    }))
    .filter((employee) => {
      const byEmployee =
        selectedEmployee === "all" || employee.name === selectedEmployee;
      const byPriority =
        selectedPriority === "all" || employee.priority === selectedPriority;
      return byEmployee && byPriority;
    });

  // Chart Data Preparation
  const getPriorityDistribution = () => {
    const distribution = { High: 0, Medium: 0, Low: 0 };
    filteredEmployees.forEach((employee) => {
      distribution[employee.priority] += 1;
    });
    return Object.values(distribution);
  };

  const getTaskTypeDistribution = () => {
    const distribution = { Bug: 0, Feature: 0 };
    filteredEmployees.forEach((employee) => {
      distribution[employee.type] += 1;
    });
    return Object.values(distribution);
  };

  const getCompletionStatusDistribution = () => {
    const distribution = {
      Completed: 0,
      InProgress: 0,
      Pending: 0,
      Overdue: 0,
    };
    filteredEmployees.forEach((employee) => {
      distribution[employee.status] += 1;
    });
    return Object.values(distribution);
  };

  const statusData = getCompletionStatusDistribution();


  const getAverageTimeComparison = () => {
    const totalTimeTaken = filteredEmployees.reduce(
      (acc, curr) => acc + curr.timeTaken,
      0
    );
    const totalTimeAllotted = filteredEmployees.reduce(
      (acc, curr) => acc + curr.timeAllotted,
      0
    );
    const avgTimeTaken = totalTimeTaken / filteredEmployees.length;
    const avgTimeAllotted = totalTimeAllotted / filteredEmployees.length;

    return { avgTimeTaken, avgTimeAllotted };
  };

  // Create and update charts
  useEffect(() => {
    const taskChartCtx = document.getElementById("taskChart").getContext("2d");
    const timeChartCtx = document.getElementById("timeChart").getContext("2d");
    const priorityChartCtx = document
      .getElementById("priorityChart")
      .getContext("2d");
    const taskTypeChartCtx = document
      .getElementById("taskTypeChart")
      .getContext("2d");
    const statusChartCtx = document
      .getElementById("statusChart")
      .getContext("2d");
    const avgTimeChartCtx = document
      .getElementById("avgTimeChart")
      .getContext("2d");

    const taskChartData = filteredEmployees.map((employee) => ({
      label: employee.task,
      data: [employee.timeTaken],
    }));

    const timeChartData = filteredEmployees.map((employee) => ({
      x: employee.timeTaken,
      y: employee.timeAllotted,
    }));

    const priorityData = getPriorityDistribution();
    const taskTypeData = getTaskTypeDistribution();
    const statusData = getCompletionStatusDistribution();
    const { avgTimeTaken, avgTimeAllotted } = getAverageTimeComparison();

    const taskChart = new Chart(taskChartCtx, {
      type: "bar",
      data: {
        labels: filteredEmployees.map((employee) => employee.task),
        datasets: taskChartData,
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Task Completion Time" },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    const timeChart = new Chart(timeChartCtx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Time Taken vs Time Allotted",
            data: timeChartData,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Time Comparison" },
        },
        scales: {
          x: { type: "linear", position: "bottom" },
          y: { beginAtZero: true },
        },
      },
    });

    const priorityChart = new Chart(priorityChartCtx, {
      type: "pie",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: priorityData,
            backgroundColor: ["#FF6347", "#FFD700", "#90EE90"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Task Priority Distribution" },
        },
      },
    });

    const taskTypeChart = new Chart(taskTypeChartCtx, {
      type: "pie",
      data: {
        labels: ["Bug", "Feature"],
        datasets: [
          {
            data: taskTypeData,
            backgroundColor: ["#FF6347", "#20B2AA"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Task Type Distribution" },
        },
      },
    });

    const statusChart = new Chart(statusChartCtx, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress", "Pending", "Overdue"],
        datasets: [
          {
            label: "Task Status",
            data: statusData,
            backgroundColor: "#3B82F6",
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Task Status Distribution" },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    const avgTimeChart = new Chart(avgTimeChartCtx, {
      type: "line",
      data: {
        labels: ["Average Time Taken", "Average Time Allotted"],
        datasets: [
          {
            label: "Average Time Comparison",
            data: [avgTimeTaken, avgTimeAllotted],
            borderColor: "#FF6347",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Average Time Taken vs Allotted" },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      taskChart.destroy();
      timeChart.destroy();
      priorityChart.destroy();
      taskTypeChart.destroy();
      statusChart.destroy();
      avgTimeChart.destroy();
    };

  }, [filteredEmployees]);

  return (
    <Container maxW="container.xl" h="100%" mt={190}>
      <Flex spacing={4}  p={4} w={'100%'} justify={'space-around'}>
        <Box p={4} w={'calc(90% / 4)'} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="lg">{statusData[0] + statusData[1] + statusData[2] + statusData[3]}</Heading>
          <Text>Total Tasks</Text>
        </Box>

        <Box p={4} w={'calc(90% / 4)'} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="lg">{statusData[0]}</Heading>
          <Text>Completed</Text>
        </Box>

        <Box p={4} w={'calc(90% / 4)'} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="lg">{statusData[2]}</Heading>
          <Text>Pending</Text>
        </Box>

        <Box p={4} w={'calc(90% / 4)'} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="lg">{statusData[3]}</Heading>
          <Text>Overdue</Text>
        </Box>
      </Flex>

      <VStack spacing={8} align="stretch">
        {/* Filters Section */}
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Select
            id="employeeFilter"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            width="200px"
            placeholder="Select Employee"
            backgroundColor="gray.50"
            borderRadius="md"
            boxShadow="md"
            fontWeight="semibold"
          >
            <option value="all">All Employees</option>
            {employeeData.map((employee) => (
              <option key={employee.name} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </Select>

          <Select
            id="priorityFilter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            width="200px"
            placeholder="Select Priority"
            backgroundColor="gray.50"
            borderRadius="md"
            boxShadow="md"
            fontWeight="semibold"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Box>

        {/* Employee Table */}
        <Box
          overflowX="auto"
          boxShadow="lg"
          borderRadius="md"
          backgroundColor="white"
          p={4}
          border="1px solid"
          borderColor="gray.200"
          _hover={{ borderColor: "teal.300" }}
          transition="all 0.2s ease-in-out"
        >
          <Table variant="striped" colorScheme="teal">
            <Thead bg="teal.600" color="white" paddingY={3}>
              <Tr>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Employee Name
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Task Name
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Type
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Priority
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Status
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Time Taken
                </Th>
                <Th
                  fontSize="18px"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingX={6}
                >
                  Time Allotted
                </Th>
              </Tr>
            </Thead>

            <Tbody mt={4}>
              {filteredEmployees.map((employee, index) => (
                <Tr
                  key={index}
                  _hover={{ bg: "teal.50" }}
                  transition="all 0.2s ease-in-out"
                >
                  <Td fontSize="14px" paddingX={6}>
                    {employee.name}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.task}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.type}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.priority}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.status}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.status === "Pending" ? "" : employee.timeTaken}
                  </Td>
                  <Td fontSize="14px" paddingX={6}>
                    {employee.status === "Pending" ? "" : employee.timeAllotted}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Graphs */}
        <Text fontSize="20px" fontWeight="semibold" color="gray.700">
          Graphical Representation
        </Text>
        <Flex justify="space-between" wrap="wrap">
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="taskChart" width="400" height="200"></canvas>
          </Box>
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="timeChart" width="400" height="200"></canvas>
          </Box>
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="priorityChart" width="400" height="200"></canvas>
          </Box>
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="taskTypeChart" width="400" height="200"></canvas>
          </Box>
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="statusChart" width="400" height="200"></canvas>
          </Box>
          <Box width={{ base: "100%", md: "45%" }} mb={8}>
            <canvas id="avgTimeChart" width="400" height="200"></canvas>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
};

export default DynamicEmployeeTableWithGraph;
