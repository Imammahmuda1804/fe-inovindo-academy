'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaReceipt, FaCertificate, FaCog, FaBook } from 'react-icons/fa';
import { getMe } from '@/lib/apiService';
import { useAuth } from '@/context/AuthContext';
import { ensureAbsoluteUrl } from '@/lib/urlHelpers';

const menuItems = [
  {
    href: '/my-courses',
    title: 'Kursus Saya',
    icon: FaBook,
  },
  {
    href: '/transactions',
    title: 'Transaksi Saya',
    icon: FaReceipt,
  },
  {
    href: '/certificates',
    title: 'Sertifikat',
    icon: FaCertificate,
  },
  {
    href: '/settings',
    title: 'Settings',
    icon: FaCog,
  },
];

const MotionLink = motion(Link);

const Sidebar = () => {
  const pathname = usePathname();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthLoading && isLoggedIn) {
        try {
          setLoadingUser(true);
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } finally {
          setLoadingUser(false);
        }
      } else if (!isAuthLoading && !isLoggedIn) {
        setUser(null);
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, isAuthLoading]);

  const userPhoto = user?.photo ? ensureAbsoluteUrl(user.photo) : "https://via.placeholder.com/80";

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-4 left-4 right-4 z-[9999] rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg overflow-hidden md:relative md:bottom-auto md:left-auto md:right-auto md:w-80 md:shrink-0 md:bg-white/50"
    >
      {/* Profile Section */}
      <div className="hidden md:block text-center p-6 border-b border-white/20">
        {loadingUser ? (
          <div className="animate-pulse">
            <div className="rounded-full bg-gray-300 h-20 w-20 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        ) : user ? (
          <>
            <div className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white/50 shadow-md overflow-hidden relative">
              <Image
                src={userPhoto}
                alt={user.name || "User Profile"}
                fill
                className="object-cover object-center"
              />
            </div>
            <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-gray-300 h-20 w-20 mx-auto mb-3"></div>
            <h3 className="font-bold text-lg text-slate-800">Guest</h3>
            <p className="text-sm text-gray-600">Please log in</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 md:p-4">
        <div className="flex flex-row justify-around md:flex-col md:space-y-2">
            {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <MotionLink
                key={item.title}
                href={item.href}
                title={item.title}
                className={`flex flex-col md:flex-row items-center p-2 md:px-4 md:py-3 text-sm md:text-base font-medium rounded-lg transition-colors ${
                    isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                >
                <item.icon className="w-5 h-5 md:mr-3" />
                <span className="mt-1 md:mt-0">{item.title}</span>
                </MotionLink>
            );
            })}
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;