'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import AnimatedContent from "@/components/animatedcontent.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import TransactionsSkeleton from "@/components/TransactionsSkeleton.jsx";
import { FaSearch, FaFileInvoiceDollar } from "react-icons/fa";

// Dummy data with added thumbnail and transaction_date
const transactions = [
  {
    id: 1,
    booking_code: 'INV-20251015-001',
    course_name: 'Full-Stack Web Development',
    thumbnail: "/assets/images/web.png",
    grand_total_amount: 750000,
    is_paid: true,
    payment_type: 'Bank Transfer',
    proof: '/path/to/proof1.jpg',
    transaction_date: '2025-10-15T10:30:00Z',
  },
  {
    id: 2,
    booking_code: 'INV-20251014-015',
    course_name: 'Data Science with Python',
    thumbnail: "/assets/images/data-sience.png",
    grand_total_amount: 950000,
    is_paid: true,
    payment_type: 'Credit Card',
    proof: '/path/to/proof2.jpg',
    transaction_date: '2025-10-14T14:00:00Z',
  },
  {
    id: 3,
    booking_code: 'INV-20251013-007',
    course_name: 'Digital Marketing Fundamentals',
    thumbnail: "/assets/images/digital-marketing.png",
    grand_total_amount: 450000,
    is_paid: false,
    payment_type: 'Virtual Account',
    proof: null,
    transaction_date: '2025-10-13T09:00:00Z',
  },
  {
    id: 4,
    booking_code: 'INV-20251012-021',
    course_name: 'UI/UX Design for Beginners',
    thumbnail: "/assets/images/ui-ux.png",
    grand_total_amount: 600000,
    is_paid: true,
    payment_type: 'E-Wallet',
    proof: '/path/to/proof4.jpg',
    transaction_date: '2025-10-12T18:45:00Z',
  },
];

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = transactions.filter(
    (trx) =>
      trx.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.booking_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(dateString).toLocaleString('id-ID', options).replace(/\./g, ':');
  };

  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
      <main className="container mx-auto py-8 pb-24 md:pb-8 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-72">
            <div className="sticky top-48">
              <Sidebar />
            </div>
          </aside>

          <div className="flex-1">
            <AnimatedContent distance={50} direction="vertical" reverse={true}>
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg">
                  Riwayat Transaksi
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Lacak dan kelola semua riwayat transaksi dan pembayaran kursus Anda.</p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} delay={0.2}>
              <div className="mb-8 p-4 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama kursus atau kode booking..."
                    className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} delay={0.4}>
              <div className="bg-white shadow-lg rounded-2xl overflow-x-auto border border-gray-200/80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Detail Kursus
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total Bayar
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Kode Booking
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-20 mr-4">
                                <Image
                                  src={trx.thumbnail}
                                  alt={trx.course_name}
                                  width={80}
                                  height={48}
                                  className="rounded-md object-contain h-full w-full"
                                />
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {trx.course_name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(trx.transaction_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(trx.grand_total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {trx.is_paid ? (
                              <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Lunas
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                            {trx.booking_code}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-16">
                          <FaFileInvoiceDollar className="mx-auto text-4xl text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg">Tidak ada transaksi yang cocok.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </main>
    </div>
  );
}
