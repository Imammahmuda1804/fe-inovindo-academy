"use client";

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  isPageLoading: false,
  setIsPageLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);

  const value = { isPageLoading, setIsPageLoading };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};