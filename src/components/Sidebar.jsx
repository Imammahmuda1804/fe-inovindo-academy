'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
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
      className="w-64 p-4 pr-8"
    >
      <nav className="flex flex-col space-y-2">
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
