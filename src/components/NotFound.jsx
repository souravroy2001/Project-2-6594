import React, { useContext } from "react";
import "/Scarecrow.png"; // Adjust the path to your asset
import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeAuth";

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeProvider);
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      w={"100%"}
      h={"100vh"}
      id="notFound"
    >
      {/* Header */}
      <Box
        fontFamily='"Inconsolata", monospace'
        mt="4rem"
        ml={{ base: "0", md: "7.7rem" }}
        textTransform="uppercase"
        textAlign="center" // Ensures it's centered on smaller screens
      >
        <Heading
          color={theme ? "#000" : "#fff"}
          mb={50}
          fontFamily='"Space Mono", monospace'
        >
          404 Not Found
        </Heading>
      </Box>

      {/* Content Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        mt="5rem"
      >
        {/* Image Section */}
        <Flex justify={'center'} align={'center'} mr={25} w={{ base: "100%", md: "40%" }}>
          <Image
            w="100%"
            maxW="500px"
            src="/Scarecrow.png"
            alt="404 Scarecrow"
          />
        </Flex>

        {/* Text Section */}
        <Box w={{ base: "100%", md: "40%", sm: "90%" }}>
          <Text
            fontSize={{ base: "2.4rem", md: "3rem" }}
            fontWeight={600}
            lineHeight={1.2}
            fontFamily='"Space Mono", monospace'
            color={theme ? "#000" : "#fff"}
          >
            I have bad news for you
          </Text>
          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            fontWeight={400}
            mt="1.5rem"
            lineHeight={1.7}
            fontFamily='"Space Mono", monospace'
            maxW="40rem"
            color={theme ? "#000" : "#fff"}
          >
            The page you are looking for might be removed or is temporarily
            unavailable.
          </Text>
          <Button
            bg="#000"
            color="#fff"
            fontFamily='"Space Mono", monospace'
            fontSize="1.4rem"
            cursor="pointer"
            px="4rem"
            py="2rem"
            _hover={{ bg: "#3d3d3d" }}
            mt="2rem"
            onClick={() => navigate("/")}
          >
            Back to homepage
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NotFound;
