import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const router = useRouter();
  const { xAuthToken, userSessionId } = useAuth();

  useEffect(() => {
    // Check if the user is logged in
    if (!xAuthToken || !userSessionId) {
      // Redirect to the login page
      router.push('/login');
    }
  }, []);

  return (
    <Box p={4}>
      <Heading size="lg">Welcome to the Home Page</Heading>
    </Box>
  );
};

export default HomePage;
