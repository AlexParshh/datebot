// Function to store values in localStorage
export const storeAuthCredentialsInLocalStorage = (
  xAuthToken: string,
  userSessionId: string
) => {
  localStorage.setItem("xAuthToken", xAuthToken);
  localStorage.setItem("userSessionId", userSessionId);
};

// Function to remove values from localStorage
export const removeAuthCredentialsFromLocalStorage = () => {
  localStorage.removeItem("xAuthToken");
  localStorage.removeItem("userSessionId");
};

// Function to get values from localStorage
export const getAuthCredentialsFromLocalStorage = () => {
  const xAuthToken = localStorage.getItem("xAuthToken");
  const userSessionId = localStorage.getItem("userSessionId");
  return { xAuthToken, userSessionId };
};

// Arrow function to set a message in local storage based on an ID
export const setMessageById = (id: string, message: string): void => {
    const messageString = JSON.stringify(message);
    localStorage.setItem(`message_${id}`, messageString);
};

// Arrow function to delete a message from local storage based on an ID
export const deleteMessageById = (id: string): void => {
    localStorage.removeItem(`message_${id}`);
};

// Arrow function to get a message from local storage based on an ID
export const getMessageById = (id: string): string | null => {
    const messageString = localStorage.getItem(`message_${id}`);
    
    if (messageString) {
        try {
            const parsedMessage: string = JSON.parse(messageString);
            return parsedMessage;
        } catch (error) {
            console.error("Error parsing message:", error);
            return null;
        }
    } else {
        return null;
    }
};

// Save the settings object to local storage
export const setSettingsToLocalStorage = (settings: {
    model: 'GPT-3.5-Turbo' | 'GPT-4';
    backgroundInfo: string;
    instagram: string;
    snapchat: string;
    phoneNumber: string;
}): void => {
    try {
        const serializedSettings = JSON.stringify(settings);
        localStorage.setItem('userSettings', serializedSettings);
    } catch (error) {
        console.error('Could not save settings to local storage:', error);
    }
};

// Retrieve the settings object from local storage
export const getSettingsFromLocalStorage = (): {
    model: 'GPT-3.5-Turbo' | 'GPT-4';
    backgroundInfo: string;
    instagram: string;
    snapchat: string;
    phoneNumber: string;
} | null => {
    try {
        const serializedSettings = localStorage.getItem('userSettings');
        if (serializedSettings === null) return null;
        return JSON.parse(serializedSettings);
    } catch (error) {
        console.error('Could not retrieve settings from local storage:', error);
        return null;
    }
};
