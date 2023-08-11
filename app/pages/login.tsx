import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'next/router';

const LoginPage = () => {
  const { setAuthCredentials } = useAuth();
  const [xAuthToken, setXAuthToken] = useState("");
  const [userSessionId, setUserSessionId] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    // Simulate authentication (replace this with actual authentication logic)
    setAuthCredentials(xAuthToken, userSessionId);

    router.push("/")
    
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.100"
    >
      <Box p={4} width="400px" bg="white" borderRadius="md" boxShadow="md">
        <Flex pt={3} justifyContent="center">
          <Heading size="md" mb={2}>
            Welcome to Tinder Bot
          </Heading>
        </Flex>
        <Flex pt={3} justifyContent="center">
          <Text mb={4}>Please provide the following details to continue</Text>
        </Flex>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <FormControl>
            <FormLabel>X-Auth-Token</FormLabel>
            <Input
              type="text"
              value={xAuthToken}
              onChange={(e) => setXAuthToken(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>User-Session-ID</FormLabel>
            <Input
              type="text"
              value={userSessionId}
              onChange={(e) => setUserSessionId(e.target.value)}
              required
            />
          </FormControl>
          <Flex pt={3} justifyContent="center">
            <Button type="submit" colorScheme="blue">
              Login
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
