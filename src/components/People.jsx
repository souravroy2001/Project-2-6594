import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import TodoApp from "./TodoApp";
import TaskList from "./TaskList ";
import TaskTable from "./TaskList ";

function People() {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      w={"100%"}
      h={"100dvh"}
      fontSize={"2xl"}
      fontWeight={600}
    >
      <TaskTable />
    </Flex>
  );
}

export default People;
