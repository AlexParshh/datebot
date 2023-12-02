import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Button,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import MatchesTabs from "../components/MatchesTabs";
import { SettingsIcon, RepeatIcon } from "@chakra-ui/icons";
import SettingsModal from "../components/SettingsModal";
import {
  setSettingsToLocalStorage,
  getSettingsFromLocalStorage,
} from "../lib/storage";

const HomePage = () => {
  const router = useRouter();
  const { xAuthToken, userSessionId, clearAuthCredentials } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any>(null);
  const [recs, setRecs] = useState<any>([]);

  // Model, Background Info, Social Media Handles, Phone Number
  const [settings, setSettings] = useState<{
    model: "GPT-3.5-Turbo" | "GPT-4";
    backgroundInfo: string;
    instagram: string;
    snapchat: string;
    phoneNumber: string;
  }>({
    model: "GPT-3.5-Turbo",
    backgroundInfo: "",
    instagram: "",
    snapchat: "",
    phoneNumber: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchRecs = async () => {
    try {
        const response = await axios.post("/api/getrecs", {
            xAuthToken,
            userSessionId,
        });
        console.log(response)
        setRecs(response.data.recommendations);
    } catch (error) {
        console.error("Error fetching recs:", error);
    }
};

  const fetchMatches = async () => {
    try {
      const response = await axios.post("/api/matches", {
        xAuthToken,
        userSessionId,
      });

      // Set the profile state with the response data
      setMatches(response.data.matches);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    if (!xAuthToken || !userSessionId) {
      // Redirect to the login page
      router.push("/login");
      return;
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.post("/api/profile", {
          xAuthToken,
          userSessionId,
        });

        // Set the profile state with the response data
        setProfile(response.data.profile.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    fetchMatches();
    fetchRecs();
  }, []);

  const handleLogout = () => {
    clearAuthCredentials();
    router.push("/login");
  };

  return (
    <Box
      p={4}
      backgroundColor={"gray"}
      height="100vh"
      color="white"
    >
      <SettingsModal
        isOpen={isOpen}
        onClose={onClose}
        setSettings={(settings) => {
          setSettings(settings);
          setSettingsToLocalStorage(settings);
        }}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg" as="h1">
          🚀 Tinder Assistant
        </Heading>

        <Flex>
          <IconButton
            mr={2}
            aria-label="Settings"
            icon={<SettingsIcon />}
            onClick={onOpen}
          />
          <Button mr={2} onClick={handleLogout}>Logout</Button>
          <IconButton
            mr={2}
            aria-label="Refresh"
            icon={<RepeatIcon />}
            onClick={fetchRecs}
          />
        </Flex>
      </Flex>
      {profile && matches && (
        <Box mt={4}>
          <Heading size="md">
            Welcome back {profile.name}!{" "}
            {`You have ${
              matches.messagedMatches.length + matches.unMessagedMatches.length
            } total matches!`}
          </Heading>
          <MatchesTabs
            settings={settings}
            matches={matches}
            profileId={profile._id}
            recs={recs}
            fetchMatches={fetchMatches}
          />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
