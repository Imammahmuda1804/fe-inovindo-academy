'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser } from '@/lib/apiService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const ExpiredSessionModal = ({ onConfirm }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Sesi Anda Berakhir</h2>
      <p className="text-gray-600 mb-6">
        Untuk keamanan, Anda telah di-logout secara otomatis. Silakan login kembali untuk melanjutkan.
      </p>
      <button
        onClick={onConfirm}
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
      >
        Ke Halaman Login
      </button>
    </div>
  </div>
);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const fetchAndSetUser = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Session possibly expired on initial load.", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);
  
  const forceLogout = useCallback(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsLoggedIn(false);
      setSessionExpired(false);
      window.location.href = '/login';
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed on server, clearing session locally.", error);
    } finally {
      forceLogout();
    }
  }, [forceLogout]);

  // This is the event handler for auth failure.
  // It's wrapped in useCallback to keep a stable reference for the event listener.
  const handleAuthFailure = useCallback(() => {
    // No more conditional checks. If this event fires, the session is dead.
    // We also check if the modal is already shown to prevent multiple triggers.
    if (!sessionExpired) {
        console.log("Global auth-failure event received. Forcing session expired modal.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsLoggedIn(false);
        setSessionExpired(true);
    }
  }, [sessionExpired]);

  // Attach the listener on component mount.
  useEffect(() => {
    window.addEventListener("auth-failure", handleAuthFailure);
    return () => {
      window.removeEventListener("auth-failure", handleAuthFailure);
    };
  }, [handleAuthFailure]);

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
      {sessionExpired && <ExpiredSessionModal onConfirm={forceLogout} />}
    </AuthContext.Provider>
  );
};