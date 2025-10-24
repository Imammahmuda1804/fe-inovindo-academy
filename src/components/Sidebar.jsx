'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaReceipt, FaCertificate, FaCog, FaBook } from 'react-icons/fa';

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

  return (
    <motion.aside
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-4 left-4 right-4 z-[9999] rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg overflow-hidden md:relative md:bottom-auto md:left-auto md:right-auto md:w-64 md:shrink-0 md:bg-white/50"
    >
      {/* Profile Section */}
      <div className="hidden md:block text-center p-6 border-b border-white/20">
        <Image
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
          alt="User Profile"
          width={80}
          height={80}
          className="rounded-full mx-auto mb-3 border-4 border-white/50 shadow-md"
        />
        <h3 className="font-bold text-lg text-slate-800">Ruben Amorim</h3>
        <p className="text-sm text-gray-600">ruben.amorim@example.com</p>
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