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
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'next/router';
import { getAuthCredentialsFromLocalStorage } from "../lib/storage";

const LoginPage = () => {
  const { setAuthCredentials } = useAuth();
  const [xAuthTokenValue, setXAuthToken] = useState("");
  const [userSessionIdValue, setUserSessionId] = useState("");

  const router = useRouter();

  // check if user is already logged in and redirect home if they are
  useEffect(() => {
    const { xAuthToken, userSessionId } = getAuthCredentialsFromLocalStorage();
    if (xAuthToken && userSessionId) {
        router.push("/");
    }
  }, [])

  const handleLogin = () => {
    // Simulate authentication (replace this with actual authentication logic)
    setAuthCredentials(xAuthTokenValue, userSessionIdValue);
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
            Welcome to Tinder Assistant
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
              value={xAuthTokenValue}
              onChange={(e) => setXAuthToken(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>User-Session-ID</FormLabel>
            <Input
              type="text"
              value={userSessionIdValue}
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
