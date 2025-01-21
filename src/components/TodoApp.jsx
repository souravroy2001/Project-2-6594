import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
  useToast,
  Textarea,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import SelectReact from "react-select";
import axios from "axios";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPriority, setNewPriority] = useState("Low");
  const [newCategory, setNewCategory] = useState("BAU");
  const [newReference, setNewReference] = useState("");
  const [newCreator, setNewCreator] = useState("");
  const [newEmployees, setNewEmployees] = useState([]);
  const [newStatus, setNewStatus] = useState("Pending");
  const toast = useToast();

  const userList = ["John Doe", "Jane Smith", "David Johnson", "Emma Brown"];
  const userOptions = userList.map((user) => ({ label: user, value: user }));

  // Fetch tasks from the server
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(
          "https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks.json"
        );
        const fetchedTasks = response.data
          ? Object.keys(response.data).map((key) => ({
              id: key,
              ...response.data[key],
            }))
          : [];
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    }
    fetchTasks();
  }, []);

  // Post a new task to the server
  async function postTasks(task) {
    try {
      const response = await axios.post(
        "https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks.json",
        task
      );
      setTasks([...tasks, { id: response.data.name, ...task }]);
      console.log("Task posted successfully");
    } catch (error) {
      console.error("Error posting task:", error.message);
    }
  }

  const addTask = () => {
    if (!newTask.trim() || !newDescription.trim() || !newCreator.trim()) {
      toast({
        title: "Task title, description, and creator cannot be empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (newEmployees.length === 0) {
      toast({
        title: "Please assign at least one employee to the task.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newTaskObject = {
      task: newTask,
      description: newDescription,
      time: newTime,
      priority: newPriority,
      category: newCategory,
      reference: newReference,
      creator: newCreator,
      employees: newEmployees.map((emp) => emp.value),
      status: newStatus,
    };

    postTasks(newTaskObject);

    setNewTask("");
    setNewDescription("");
    setNewTime("");
    setNewPriority("Low");
    setNewCategory("BAU");
    setNewReference("");
    setNewCreator("");
    setNewEmployees([]);
    setNewStatus("Pending");
  };

  // Delete a task from the server
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks/${id}.json`
      );
      setTasks(tasks.filter((task) => task.id !== id));
      toast({
        title: "Task deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // Edit a task on the server
  const editTask = async (id, updatedTask) => {
    try {
      await axios.put(
        `https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks/${id}.json`,
        updatedTask
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );
      toast({
        title: "Task updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  // Update status of a task
  const updateStatus = async (id, updatedStatus) => {
    // Update status locally
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: updatedStatus } : task
      )
    );

    // Optional: Mock an API request to update on the server
    try {
      await axios.patch(
        `https://masai-hackathon-2025-default-rtdb.firebaseio.com/tasks/${id}.json`,
        { status: updatedStatus }
      );
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  return (
    <Flex flexDir={"column"} w={"100%"} minH={"100dvh"} maxH={"100%"} m={10} mt={190}>
      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={5}
        
        borderWidth="1px"
        borderRadius="lg"
      >
        <Text fontSize={"2xl"} mb={4} fontWeight="bold">
          Employee Task Logging
        </Text>

        <HStack mb={4}>
          <Input
            placeholder="Task Title"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            fontSize="sm"
          />
        </HStack>

        <Textarea
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          mb={4}
          fontSize="sm"
        />

        <HStack mb={4}>
          <Input
            placeholder="Time Spent"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            fontSize="sm"
          />
          <SelectReact
            options={[
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
            ]}
            value={{ label: newPriority, value: newPriority }}
            onChange={(e) => setNewPriority(e.value)}
            placeholder="Priority"
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                minWidth: "150px",
                maxWidth: "100%",
                fontSize: "14px",
                flex: 1,
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                width: "100%",
                minWidth: "100%",
              }),
              menuList: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
          />
        </HStack>

        <HStack mb={4}>
          <SelectReact
            options={[
              { label: "BAU", value: "BAU" },
              { label: "Ad Hoc", value: "Ad Hoc" },
              { label: "Project-Based", value: "Project-Based" },
            ]}
            value={{ label: newCategory, value: newCategory }}
            onChange={(e) => setNewCategory(e.value)}
            placeholder="Category"
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                minWidth: "150px",
                maxWidth: "100%",
                fontSize: "14px",
                flex: 1,
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                width: "100%",
                minWidth: "100%",
              }),
              menuList: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
          />
          <Input
            placeholder="Reference (e.g., manager)"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            fontSize="sm"
          />
        </HStack>

        <HStack mb={4}>
          <SelectReact
            options={userOptions}
            value={userOptions.find((user) => user.value === newCreator)}
            onChange={(e) => setNewCreator(e?.value || "")}
            placeholder="Select Task Creator"
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                minWidth: "350px",
                maxWidth: "100%",
                fontSize: "14px",
                flex: 1,
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                width: "100%",
                minWidth: "100%",
              }),
              menuList: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
          />
        </HStack>

        <HStack mb={4} w="100%">
          <SelectReact
            isMulti
            options={userOptions}
            value={newEmployees}
            onChange={setNewEmployees}
            placeholder="Select Assigned Employees"
            fontSize="sm"
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                minWidth: "350px",
                maxWidth: "100%",
                fontSize: "14px",
                flex: 1,
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                width: "100%",
                minWidth: "100%",
              }),
              menuList: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
          />
        </HStack>
        <HStack mb={4} w="100%">
          <SelectReact
            options={[
              { label: "Pending", value: "Pending" },
              { label: "In-Progress", value: "In-Progress" },
              { label: "Complete", value: "Complete" },
              { label: "Overdue", value: "Overdue" },
            ]}
            value={{ label: newStatus, value: newStatus }}
            onChange={(e) => setNewStatus(e.value)}
            placeholder="Select Initial Status"
            fontSize="sm"
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                minWidth: "350px",
                maxWidth: "100%",
                fontSize: "14px",
                flex: 1,
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                width: "100%",
                minWidth: "100%",
              }),
              menuList: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
          />
        </HStack>

        <Button
          _hover={{
            bg: "linear-gradient(90deg, rgba(28, 101, 197, 1) 0%, rgba(227, 78, 42, 1) 50%,rgba(246, 121, 35, 1) 100%)",
          }}
          bg={
            "linear-gradient(90deg, rgba(28, 101, 197, 1) 0%, rgba(227, 78, 42, 1) 50%,rgba(246, 121, 35, 1) 100%)"
          }
          color={"#fff"}
          onClick={addTask}
          mb={4}
          w="100%"
        >
          Add Task
        </Button>
      </Box>

      <Grid
        width="100%"
        gridTemplateColumns="repeat(3, 1fr)"
        gap={4} // Adds space between grid items
        mt={50}
        mb={500}
      >
        {tasks.map((task) => (
          <Box key={task.id} borderWidth="1px" p={4} borderRadius="lg">
            <HStack justifyContent="space-between" mb={2}>
              <Editable
                defaultValue={task.task}
                onSubmit={(newText) => {
                  editTask(task.id, { ...task, task: newText });
                }}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete Task"
              />
            </HStack>

            {/* Aligning all fields in a single line */}
            <VStack align="start" spacing={2}>
              <HStack>
                <Text as="strong">Description:</Text>
                <Editable
                  defaultValue={task.description}
                  onSubmit={(newText) => {
                    editTask(task.id, { ...task, description: newText });
                  }}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </HStack>

              <HStack>
                <Text as="strong">Time Spent:</Text>
                <Editable
                  defaultValue={task.time}
                  onSubmit={(newText) => {
                    editTask(task.id, { ...task, time: newText });
                  }}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </HStack>

              <HStack>
                <Text as="strong">Priority:</Text>
                <Editable
                  defaultValue={task.priority}
                  onSubmit={(newText) => {
                    editTask(task.id, { ...task, priority: newText });
                  }}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </HStack>

              <HStack>
                <Text as="strong">Status:</Text>
                <SelectReact
                  options={[
                    { label: "Pending", value: "Pending" },
                    { label: "In-Progress", value: "In-Progress" },
                    { label: "Complete", value: "Complete" },
                    { label: "Overdue", value: "Overdue" },
                  ]}
                  value={{ label: task.status, value: task.status }}
                  onChange={(e) => updateStatus(task.id, e.value)}
                  placeholder="Update Status"
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "150px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontSize: "14px",
                    }),
                    input: (base) => ({
                      ...base,
                      fontSize: "14px",
                    }),
                    option: (base) => ({
                      ...base,
                      fontSize: "14px",
                    }),
                  }}
                />
              </HStack>
            </VStack>

            <Text>
              <strong>Category:</strong> {task.category}
            </Text>
            <Text>
              <strong>Reference:</strong> {task.reference}
            </Text>
            <Text>
              <strong>Creator:</strong> {task.creator}
            </Text>
            <Text>
              <strong>Assigned to:</strong> {task.employees.join(", ")}
            </Text>
          </Box>
        ))}
      </Grid>
    </Flex>
  );
};

export default TodoApp;
