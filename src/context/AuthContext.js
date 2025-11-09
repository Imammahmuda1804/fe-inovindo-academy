'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logoutUser } from '@/lib/apiService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To know when initial user fetch is done

  const fetchAndSetUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Session expired or invalid", error);
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed on server, clearing session locally.", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    refetchUser: fetchAndSetUser, // Expose a function to re-fetch user after login
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
