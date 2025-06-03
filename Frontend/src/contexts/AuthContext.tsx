import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AuthService from '@/services/auth.service';

// Define User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: { name: string; email: string; password: string }) => Promise<any>;
  logout: () => void;
  forceRefresh: () => void; // Add a function to force refresh auth state
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
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

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Add a refresh counter to force re-renders when needed
  const [refreshCounter, setRefreshCounter] = useState(0);

  const forceRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set authorization header for all future requests
          AuthService.setAuthToken(token);
          const response = await AuthService.getCurrentUser();
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem('token');
        AuthService.resetAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [refreshCounter]); // Add refreshCounter as a dependency

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await AuthService.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    const response = await AuthService.register(userData);
    const { token, user: newUser } = response.data;
    
    // Set token in localStorage
    localStorage.setItem('token', token);
    
    // Set authorization header for all future requests
    AuthService.setAuthToken(token);
    
    // Update user state
    setUser(newUser);
    
    return response;
  };

  const logout = () => {
    // Clear token and reset auth header
    localStorage.removeItem('token');
    AuthService.resetAuthToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forceRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};