import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    PropsWithChildren 
} from 'react';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'userAuthToken';
const USER_DATA_KEY = 'currentAuthUser'; 

export type CurrentUser = { id: number; email: string; username: string };

type AuthContextType = {
  authToken: string | null;
  currentUser: CurrentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (token: string, user: CurrentUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- SECURE STORE FUNKTIONEN ---
const loadAuthData = async (): Promise<{ token: string | null, user: CurrentUser | null }> => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
    
    let user: CurrentUser | null = null;
    if (userJson) {
        try {
            user = JSON.parse(userJson);
        } catch (e) {
            console.error("Failed to parse user data:", e);
        }
    }
    return { token, user };
};

const deleteAuthData = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
};


export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initiales Laden des Auth-Status beim Start der App
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { token, user } = await loadAuthData();
      setAuthToken(token);
      setCurrentUser(user);
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const signIn = async (token: string, user: CurrentUser) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
  };

  const signOut = async () => {
    await deleteAuthData();
    setAuthToken(null);
    setCurrentUser(null);
  };

  const isLoggedIn = !!authToken && !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        isLoggedIn,
        isLoading,
        signIn,
        signOut,
      }}
    >
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