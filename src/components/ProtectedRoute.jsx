'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Show a loader while the auth state is being determined
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (isLoggedIn) {
    // If the user is logged in, render the children components
    return <>{children}</>;
  }

  // If the user is not logged in, they will be redirected by the AuthContext.
  // Returning null prevents a flash of content or a misleading loader.
  return null;
};

export default ProtectedRoute;
