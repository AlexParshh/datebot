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
