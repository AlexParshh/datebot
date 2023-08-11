import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  xAuthToken: string;
  userSessionId: string;
  setAuthCredentials: (token: string, sessionId: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [xAuthToken, setXAuthToken] = useState('');
  const [userSessionId, setUserSessionId] = useState('');

  const setAuthCredentials = (token: string, sessionId: string) => {
    setXAuthToken(token);
    setUserSessionId(sessionId);
  };

  return (
    <AuthContext.Provider value={{ xAuthToken, userSessionId, setAuthCredentials }}>
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
