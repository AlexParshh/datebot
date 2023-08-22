import { useState, useEffect } from "react";
import {
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Tabs,
  Box,
  Flex,
  SimpleGrid,
  Image,
  Text,
  Link,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  setMessageById,
  getMessageById,
  deleteMessageById,
} from "../lib/storage";

interface MatchesTabsProps {
  settings: any;
  matches: any; // Replace with the actual type for your matches object
  profileId: string;
  fetchMatches: () => void;
}

const PICKUP_LINE_ID = "000000000000000000000000";

const MatchesTabs: React.FC<MatchesTabsProps> = ({
  settings,
  matches,
  profileId,
  fetchMatches,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [generatedRizzMessages, setGeneratedRizzMessages] = useState<{
    [key: string]: string;
  }>({});

  const { xAuthToken, userSessionId } = useAuth();

  const onClickGenerateRizz = async (userId: string) => {
    console.log("Getting rizz for, ", userId);

    try {
      console.log(settings);

      const pickupline = await axios.post("/api/generatepickupline", {
        xAuthToken,
        userSessionId,
        userId,
        model: settings.model || "GPT-3.5-Turbo",
      });

      console.log("Generated rizz: ", pickupline.data.pickupline);

      // id will be in the format of YOUR_ID-MATCH_USER_ID
      // store the generated rizz in localStorage because too lazy to make a database
      setMessageById(profileId + "-" + userId, PICKUP_LINE_ID+"-"+pickupline.data.pickupline);

      // update generatedRizzMessages to display the result
      setGeneratedRizzMessages((prevState) => ({
        ...prevState,
        [userId]: pickupline.data.pickupline,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const onClickGenerateConversation = async (
    userId: string,
    matchId: string
  ) => {
    console.log("Creating conversation rizz for, ", userId);

    try {
      const message = await axios.post("/api/generateconversation", {
        xAuthToken,
        userSessionId,
        userId,
        matchId,
        profileId,
        model: settings.model || "GPT-3.5-Turbo",
        // if user has provided additional information then it will be included in the message generation prompt
        personalInfo:
          settings.phoneNumber ||
          settings.snapchat ||
          settings.instagram ||
          settings.backgroundInfo
            ? JSON.stringify(settings)
            : undefined,
      });

      console.log("Generated rizz: ", message);
      // id will be in the format of YOUR_ID-MATCH_USER_ID
      // store the generated rizz in localStorage because too lazy to make a database
      setMessageById(profileId + "-" + userId, message.data.latestMessageId+"-"+message.data.response);

      // update generatedRizzMessages to display the result
      setGeneratedRizzMessages((prevState) => ({
        ...prevState,
        [userId]: message.data.response,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // method to remove generated rizz from UI state
  const removeGeneratedRizz = (userIdToRemove: string) => {
    setGeneratedRizzMessages((prevState) => {
      // Create a copy of the state object
      const newState = { ...prevState };

      // Delete the key-value pair with the specified userId
      delete newState[userIdToRemove];

      return newState;
    });
  };

  const onClickSendRizz = async (userId: string, matchId: string) => {
    console.log("Sending rizz for, ", userId);

    try {
      const message = generatedRizzMessages[userId];
      await axios.post("/api/sendMessage", {
        matchId,
        profileId,
        otherId: userId,
        xAuthToken,
        userSessionId,
        message,
      });

      deleteMessageById(profileId + "-" + userId);
      removeGeneratedRizz(userId);
      fetchMatches();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // initialize generatedRizzMessages with localStorage one time on initial UI load
    const rizzMessages: any = {};

    for (let i = 0; i < matches.unMessagedMatches.length; i++) {
      const matchUserId: string = matches.unMessagedMatches[i].person._id;
      const rizz = getMessageById(profileId + "-" + matchUserId);
      if (rizz) {
        // need to check if they have been messaged on the app, if so we need to clear the previously generated rizz
        if (matches.unMessagedMatches[i].messages[0]) {
          deleteMessageById(profileId + "-" + matchUserId);
        } else {
            rizzMessages[matchUserId] = rizz.slice(25);
        }
      }
    }
    for (let i = 0; i < matches.messagedMatches.length; i++) {
      const matchUserId: string = matches.messagedMatches[i].person._id;
      const rizz = getMessageById(profileId + "-" + matchUserId);
      if (rizz) {

        const currentLastMessageId = matches.messagedMatches[i].messages[0]._id;
        const messageIdForGeneratedConvo = rizz.slice(0,24)

        if (messageIdForGeneratedConvo !== currentLastMessageId) {
            // there has been messaging on the app after this message was generated, so we must clear it from localStorage
            // the message ID that the response was generated for is now no longer the latest message ID.
            deleteMessageById(profileId + "-" + matchUserId);
        } else {
            rizzMessages[matchUserId] = rizz.slice(25);
        }
      }
    }

    setGeneratedRizzMessages(rizzMessages);
  }, []);

  return (
    <Box mt={4}>
      <Tabs
        isFitted
        colorScheme="teal"
        onChange={(index) => setTabIndex(index)}
      >
        <TabList borderBottom="none">
          <Tab
            _selected={{ color: "teal.800", bg: "white" }}
            _focus={{ boxShadow: "none" }}
            borderRadius={"5px"}
          >
            Messaged ({matches.messagedMatches.length})
          </Tab>
          <Tab
            _selected={{ color: "teal.800", bg: "white" }}
            _focus={{ boxShadow: "none" }}
            borderRadius={"5px"}
          >
            Unmessaged ({matches.unMessagedMatches.length})
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box maxH="90vh" overflowY="auto">
              <SimpleGrid columns={4} spacing={4}>
                {matches.messagedMatches.map((match: any) => (
                  <Box
                    key={match._id}
                    p={4}
                    backgroundColor={"darkgray"}
                    borderRadius="md"
                    textAlign="center"
                    display="flex"
                    flexDirection="column" // Stack items vertically
                  >
                    <Flex direction="column" alignItems="center" pb={2}>
                      <Image
                        src={match.person.photos[0].url}
                        alt={match.person.name}
                        height={"145px"}
                        width={"110px"}
                        borderRadius={"5px"}
                      />
                      <Link
                        href={"https://tinder.com/app/messages/" + match.id}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text mt={2} fontWeight="bold">
                          {match.person.name}
                        </Text>
                      </Link>
                      <Text>
                        {match.messages[0].from === profileId
                          ? "Me: " + match.messages[0].message
                          : match.person.name +
                            ": " +
                            match.messages[0].message}
                      </Text>
                    </Flex>
                    <Button
                      mt="auto"
                      backgroundColor={"white"}
                      onClick={() =>
                        onClickGenerateConversation(match.person._id, match.id)
                      }
                    >
                      {" "}
                      Generate Rizz
                      <Image
                        pl={2}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
                        alt="chatGPT"
                        width="30px"
                      />
                    </Button>
                    {generatedRizzMessages[match.person._id] ? (
                      <>
                        <Button
                          bg="white"
                          mt={2}
                          onClick={() =>
                            onClickSendRizz(match.person._id, match.id)
                          }
                        >
                          {" "}
                          Send Rizz 🔥
                        </Button>{" "}
                        <Box
                          borderRadius="md"
                          bg="white"
                          p={2}
                          mt={2}
                          textColor={"black"}
                        >
                          <Text fontWeight="bold">Rizz:</Text>
                          <Text>{generatedRizzMessages[match.person._id]}</Text>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box maxH="90vh" overflowY="auto">
              <SimpleGrid columns={4} spacing={4}>
                {matches.unMessagedMatches.map((match: any) => (
                  <Box
                    key={match._id}
                    p={4}
                    backgroundColor={"darkgray"}
                    borderRadius="md"
                    textAlign="center"
                    display="flex"
                    flexDirection="column" // Stack items vertically
                  >
                    <Flex direction="column" alignItems="center" pb={2}>
                      <Image
                        src={match.person.photos[0].url}
                        alt={match.person.name}
                        width="115px"
                        height="145px"
                        borderRadius={"5px"}
                      />
                      <Link
                        href={"https://tinder.com/app/messages/" + match.id}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text mt={2} fontWeight="bold">
                          {match.person.name}
                        </Text>
                      </Link>
                      {match.person.bio ? (
                        <Text>Bio: {match.person.bio}</Text>
                      ) : null}
                    </Flex>
                    <Button
                      mt="auto"
                      bg="white"
                      onClick={() => onClickGenerateRizz(match.person._id)}
                    >
                      {" "}
                      Generate Rizz
                      <Image
                        pl={2}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
                        alt="chatGPT"
                        width="30px"
                      />
                    </Button>

                    {generatedRizzMessages[match.person._id] ? (
                      <>
                        <Button
                          bg="white"
                          mt={2}
                          onClick={() =>
                            onClickSendRizz(match.person._id, match.id)
                          }
                        >
                          {" "}
                          Send Rizz 🔥
                        </Button>{" "}
                        <Box
                          borderRadius="md"
                          bg="white"
                          p={2}
                          mt={2}
                          textColor={"black"}
                        >
                          <Text fontWeight="bold">Rizz:</Text>
                          <Text>{generatedRizzMessages[match.person._id]}</Text>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MatchesTabs;
