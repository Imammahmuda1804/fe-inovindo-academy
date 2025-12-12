"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getMe, logoutUser, setupInterceptors } from "@/lib/apiService";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Define logout logic. useCallback ensures it's stable as long as `router` is stable.
  const forceLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsLoggedIn(false);
    // Set loading to false to prevent components from being stuck in a loading state.
    setIsLoading(false);
    router.push("/login");
  }, [router]);

  // This useEffect runs ONLY ONCE on component mount to set up global interceptors.
  useEffect(
    () => {
      // This function is passed to the interceptor.
      // It closes over the `forceLogout` from the initial render, which is stable.
      const handleAuthFailure = () => {
        forceLogout();
      };

      // Pass the stable logout handler to the interceptor setup.
      setupInterceptors(handleAuthFailure);

      const fetchAndSetUser = async () => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          try {
            const userData = await getMe();
            setUser(userData);
            setIsLoggedIn(true);
          } catch (error) {
            console.error(
              "Failed to fetch user on initial load, could be an invalid token.",
              error
            );
            // Don't call forceLogout here directly.
            // The interceptor will catch the 401 from getMe and call handleAuthFailure.
            // This prevents duplicate logout calls.
          }
        }
        setIsLoading(false);
      };

      // Check the initial user status.
      fetchAndSetUser();
      // The empty dependency array [] is crucial to ensure this runs only once.
    }, []
  ); // <-- Empty dependency array ensures this runs once.

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Server logout failed, forcing client-side logout.", error);
    } finally {
      // Still call forceLogout to ensure client state is cleared and redirected.
      forceLogout();
    }
  }, [forceLogout]);

  // Exposed function to allow components to refetch user data if needed.
  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to refetch user.", error);
        // Interceptor will handle auth failure if token is invalid.
      }
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    refetchUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
