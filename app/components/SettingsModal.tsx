import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Textarea,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { getSettingsFromLocalStorage } from "../lib/storage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setSettings: (settings: {
    model: "GPT-3.5-Turbo" | "GPT-4";
    backgroundInfo: string;
    instagram: string;
    snapchat: string;
    phoneNumber: string;
  }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  setSettings,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>("GPT-3.5-Turbo");
  const [backgroundInfo, setBackgroundInfo] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [snapchat, setSnapchat] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    // Fetches settings from localStorage, to be passed into the generateConversation endpoint.
    const settings = getSettingsFromLocalStorage();
    
    if (settings) {
        setSelectedModel(settings.model);
        setBackgroundInfo(settings.backgroundInfo);
        setInstagram(settings.instagram);
        setSnapchat(settings.snapchat);
        setPhoneNumber(settings.phoneNumber);
        setSettings(settings);
    }
  }, []);

  const handleSaveChanges = () => {
    setSettings({
      // @ts-ignore
      selectedModel,
      backgroundInfo,
      instagram,
      snapchat,
      phoneNumber,
    });
    onClose(); // close the modal after saving changes
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings ⚙️</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mt={4}>
            <FormLabel>Choose Model</FormLabel>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="GPT-3.5-Turbo">GPT-3.5-Turbo</option>
              <option value="GPT-4">GPT-4</option>
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Background Information</FormLabel>
            <Textarea
              value={backgroundInfo}
              onChange={(e) => setBackgroundInfo(e.target.value)}
              placeholder="Enter additional background information about yourself"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Instagram</FormLabel>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Enter Instagram handle"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Snapchat</FormLabel>
            <Input
              value={snapchat}
              onChange={(e) => setSnapchat(e.target.value)}
              placeholder="Enter Snapchat handle"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
