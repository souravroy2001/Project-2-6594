import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import TodoApp from "./TodoApp";

function Salary() {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      w={"100%"}
      h={"100dvh"}
      fontSize={"2xl"}
      fontWeight={600}
    >
      <TodoApp />
    </Flex>
  );
}

export default Salary;
