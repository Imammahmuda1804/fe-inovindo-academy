'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser, setupInterceptors } from '@/lib/apiService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // This is the single source of truth for logging out the user and redirecting.
  const forceLogout = useCallback(() => {
    console.log("Forcing logout and redirecting to login.");
    // Clear tokens first
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Reset all states
    setUser(null);
    setIsLoggedIn(false);
    setIsLoading(false); // Crucial: stop loading states
    // Redirect
    router.push('/login');
  }, [router]);

  // This function is passed to the interceptor.
  // When a refresh fails, it will trigger a definitive logout.
  const handleAuthFailure = useCallback(() => {
    forceLogout();
  }, [forceLogout]);

  const fetchAndSetUser = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to fetch user, authentication error.", error);
        // If getMe fails with 401, it means the token is invalid.
        handleAuthFailure();
      }
    }
    setIsLoading(false);
  }, [handleAuthFailure]);

  useEffect(() => {
    // Pass the logout handler to the interceptor setup
    setupInterceptors(handleAuthFailure);
    // Then check the initial user status
    fetchAndSetUser();
  }, [fetchAndSetUser, handleAuthFailure]);

  const logout = useCallback(async () => {
    try {
      // Try to log out from the server
      await logoutUser();
    } catch (error) {
      // Even if server logout fails, force it on the client
      console.error("Server logout failed, forcing client-side logout.", error);
    } finally {
      forceLogout();
    }
  }, [forceLogout]);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    refetchUser: fetchAndSetUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};