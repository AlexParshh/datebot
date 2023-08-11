import { useState } from "react";
import {
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Tabs,
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Image,
  Text,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { RiAiGenerate } from "react-icons/ri"; // Import the icon from react-icons
import { BsFillChatLeftFill } from "react-icons/bs";
import chatgpticon from "../assets/chatgpticon.png";

interface MatchesTabsProps {
  matches: any; // Replace with the actual type for your matches object
  profileId: string;
}

const MatchesTabs: React.FC<MatchesTabsProps> = ({ matches, profileId }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box mt={4}>
      <Tabs
        isFitted
        colorScheme="teal"
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
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
                    border="2px solid teal"
                    borderColor="teal.800"
                    borderRadius="md"
                    textAlign="center"
                    display="flex"
                    flexDirection="column" // Stack items vertically
                  >
                    <Flex direction="column" alignItems="center" pb={2}>
                      <Image
                        src={match.person.photos[0].url}
                        alt={match.person.name}
                        boxSize="100px"
                        borderRadius={"5px"}
                      />
                      <Text mt={2} fontWeight="bold">
                        {match.person.name}
                      </Text>
                      <Text>
                        {match.messages[0].from === profileId
                          ? "Me: " + match.messages[0].message
                          : match.person.name +
                            ": " +
                            match.messages[0].message}
                      </Text>
                    </Flex>
                    <Button mt="auto">
                      {" "}
                      Generate Rizz
                      <Image
                        pl={2}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
                        alt="chatGPT"
                        width="30px"
                      />
                    </Button>
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
                    border="2px solid teal"
                    borderColor="teal.800"
                    borderRadius="md"
                    textAlign="center"
                    display="flex"
                    flexDirection="column" // Stack items vertically
                  >
                    <Flex direction="column" alignItems="center" pb={2}>
                      <Image
                        src={match.person.photos[0].url}
                        alt={match.person.name}
                        boxSize="100px"
                        borderRadius={"5px"}
                      />
                      <Text mt={2} fontWeight="bold">
                        {match.person.name}
                      </Text>
                      <Text>Bio: {match.person.bio}</Text>
                    </Flex>
                    <Button mt="auto">
                      {" "}
                      Generate Rizz
                      <Image
                        pl={2}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
                        alt="chatGPT"
                        width="30px"
                      />
                    </Button>
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
