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
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden"
    >
      {/* Profile Section */}
      <div className="text-center p-6 border-b border-white/20">
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
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <MotionLink
              key={item.title}
              href={item.href}
              className={`flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </MotionLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;