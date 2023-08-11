import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuthCredentialsFromLocalStorage, storeAuthCredentialsInLocalStorage, removeAuthCredentialsFromLocalStorage } from "../lib/storage";

type AuthContextType = {
  xAuthToken: string;
  userSessionId: string;
  setAuthCredentials: (token: string, sessionId: string) => void;
  clearAuthCredentials: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [xAuthToken, setXAuthToken] = useState('');
  const [userSessionId, setUserSessionId] = useState('');

  useEffect(() => {
    // Try to get values from localStorage
    const { xAuthToken: storedXAuthToken, userSessionId: storedUserSessionId } = getAuthCredentialsFromLocalStorage();

    if (storedXAuthToken && storedUserSessionId) {
      setXAuthToken(storedXAuthToken);
      setUserSessionId(storedUserSessionId);
    }
  }, []);

  const setAuthCredentials = (token:string, sessionId:string) => {
    storeAuthCredentialsInLocalStorage(token, sessionId);
    setXAuthToken(token);
    setUserSessionId(sessionId);
  };

  const clearAuthCredentials = () => {
    removeAuthCredentialsFromLocalStorage();
    setXAuthToken('');
    setUserSessionId('');
  };

  return (
    <AuthContext.Provider value={{ xAuthToken, userSessionId, setAuthCredentials, clearAuthCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
