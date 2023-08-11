import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const router = useRouter();
  const { xAuthToken, userSessionId, clearAuthCredentials } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any>(null);

  useEffect(() => {
    // Check if the user is logged in
    if (!xAuthToken || !userSessionId) {
      // Redirect to the login page
      router.push('/login');
      return;
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.post('/api/profile', {
          xAuthToken,
          userSessionId,
        });

        // Set the profile state with the response data
        setProfile(response.data.profile.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchMatches = async () => {
      try {
        const response = await axios.post('/api/matches', {
          xAuthToken,
          userSessionId,
        });

        // Set the profile state with the response data
        setMatches(response.data.matches);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
    fetchMatches();
  }, []);

  const handleLogout = () => {
    clearAuthCredentials();
    router.push('/login');
  };

  return (
    <Box
      p={4}
      bgGradient="linear(to-b, teal.400, teal.700)"
      height="100vh"
      color="white"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg" as="h1">
          🚀 Tinder Assistant
        </Heading>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
      {profile && (
        <Box mt={4}>
          <Heading size="md">
            Welcome back {profile ? profile.name+"!" : ""} {matches ? `You have ${matches.length} total matches!`: ""}
          </Heading>
          {/* You can add more personalized content here */}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
