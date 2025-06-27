import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password?: string) => {
    // Mock authentication - in real app, this would call your auth service
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
      isGuest: false
    });
  };

  const logout = () => {
    setUser(null);
  };

  const loginAsGuest = () => {
    setUser({
      id: 'guest',
      email: 'guest@echovault.com',
      name: 'Guest',
      isGuest: true
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loginAsGuest,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};