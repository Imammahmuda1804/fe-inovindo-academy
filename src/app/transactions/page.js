'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import AnimatedContent from "@/components/animatedcontent.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import TransactionsSkeleton from "@/components/TransactionsSkeleton.jsx";
import { FaSearch, FaFileInvoiceDollar, FaEye, FaDownload, FaCreditCard } from "react-icons/fa";
import { getMyTransactions } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TransactionsPage() {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Load Midtrans Snap script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      console.error("Midtrans client key is not set in environment variables.");
      return;
    }

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const scriptInBody = document.querySelector(`script[src="${snapScript}"]`);
      if (scriptInBody) {
        document.body.removeChild(scriptInBody);
      }
    };
  }, []);

  const handleContinuePayment = (snapToken) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Tidak dapat melanjutkan pembayaran.");
      console.error("snapToken is missing or undefined.");
      return;
    }

    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log('Payment successful', result);
          router.refresh(); // Refresh data on page
        },
        onPending: function (result) {
          console.log('Payment pending', result);
        },
        onError: function (result) {
          console.error('Payment error', result);
        },
        onClose: function () {
          alert('Anda menutup jendela pembayaran sebelum menyelesaikan transaksi.');
        }
      });
    } else {
      console.error('Snap.js is not loaded yet');
    }
  };

  useEffect(() => {
    const fetchTransactionsData = async () => {
      if (isLoggedIn) {
        try {
          setIsLoading(true);
          const data = await getMyTransactions();
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchTransactionsData();
    }
  }, [isLoggedIn, isAuthLoading]);

  const filteredTransactions = transactions.filter(
    (trx) =>
      trx.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.transaction_code.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(trx => ({
    id: trx.id,
    booking_trx_id: trx.booking_trx_id,
    transaction_code: trx.transaction_code,
    course_name: trx.course?.name || 'N/A',
    thumbnail: ensureAbsoluteUrl(trx.course?.thumbnail) || "/assets/images/home.png",
    grand_total_amount: trx.grand_total_amount,
    is_paid: trx.is_paid,
    payment_type: trx.payment_type,
    proof: trx.proof,
    transaction_date: trx.created_at,
    sub_total_amount: trx.sub_total_amount,
    total_tax_amount: trx.total_tax_amount,
    pricing_name: trx.pricing?.name || 'N/A',
    snap_expiry: trx.snap_expiry,
    snap_token: trx.midtrans_snap_token,
  }));

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(dateString).toLocaleString('id-ID', options).replace(/\./g, ':');
  };

  const handleViewProof = (transaction) => {
    router.push(`/payment-success/${transaction.booking_trx_id}`);
  };

  return (
    <ProtectedRoute>
      {isAuthLoading || isLoading ? (
        <TransactionsSkeleton />
      ) : (
        <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
          <main className="container mx-auto py-8 pb-24 md:pb-8 relative">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <aside className="w-full lg:w-72">
                <div className="md:sticky top-48">
                  <Sidebar />
                </div>
              </aside>

              <div className="flex-1 isolate">
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
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative w-full sm:max-w-md">
                        <input
                          type="text"
                          placeholder="Cari berdasarkan nama kursus atau kode transaksi..."
                          className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={50} delay={0.4}>
                  <div className="bg-white shadow-lg rounded-2xl overflow-x-auto border border-gray-200/80">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Detail Kursus
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Tanggal
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Total Bayar
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Kode Transaksi
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Tipe Pembayaran
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((trx) => {
                            const isExpired = trx.is_paid ? false : (trx.snap_expiry ? new Date() > new Date(trx.snap_expiry) : false);

                            return (
                              <tr key={trx.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-3 py-2">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-16 mr-2">
                                      <Image
                                        src={trx.thumbnail}
                                        alt={trx.course_name}
                                        width={64}
                                        height={40}
                                        className="rounded-md object-contain h-full w-full"
                                      />
                                    </div>
                                    <div className="text-sm font-medium text-gray-800">
                                      {trx.course_name}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {formatDate(trx.transaction_date)}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-800 font-semibold">
                                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(trx.grand_total_amount)}
                                </td>
                                <td className="px-3 py-2 text-sm">
                                  {trx.is_paid ? (
                                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Lunas
                                    </span>
                                  ) : isExpired ? (
                                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Kedaluwarsa
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-sm font-mono text-gray-700">
                                  {trx.transaction_code}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {trx.payment_type}
                                </td>
                                <td className="px-3 py-2 text-sm font-medium">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                    <button
                                      onClick={() => handleViewProof(trx)}
                                      className="w-full sm:w-auto inline-flex items-center px-2 py-1 border border-transparent text-[0.65rem] leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                    >
                                      <FaEye className="mr-0.5" /> Lihat
                                    </button>
                                    {!trx.is_paid && !isExpired && (
                                      <button
                                        onClick={() => handleContinuePayment(trx.snap_token)}
                                        className="w-full sm:w-auto inline-flex items-center px-2 py-1 border border-transparent text-[0.65rem] leading-4 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                                      >
                                        <FaCreditCard className="mr-0.5" /> Lanjutkan Bayar
                                      </button>
                                    )}
                                    {trx.proof && (
                                      <a
                                        href={ensureAbsoluteUrl(trx.proof)}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center px-2 py-1 border border-gray-300 text-[0.65rem] leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                      >
                                        <FaDownload className="mr-0.5" /> Unduh
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-16">
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
      )}
    </ProtectedRoute>
  );
}