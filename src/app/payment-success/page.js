'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    FaCheck, FaHome, FaGraduationCap, FaHashtag, FaCalendarAlt, 
    FaCreditCard, FaPrint, FaChevronDown 
} from 'react-icons/fa';
import Link from 'next/link';
import './style.css';

// Fungsi utilitas
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Data dummy untuk development
const dummyTransaction = {
  transaction_id: "TRX-DUMMY-12345",
  payment_date: new Date().toISOString(),
  payment_method: "Midtrans (Dummy)",
  subtotal: 599000,
  tax: 65890,
  total: 664890,
  course: { name: "Belajar Desain UI/UX dari Dasar hingga Mahir" },
  plan: { name: "Premium Plan" },
};

export default function PaymentSuccessPage() {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("transactionData");
    if (data) {
      setTransaction(JSON.parse(data));
    } else {
      console.warn(
        "Data transaksi tidak ditemukan. Menampilkan data dummy untuk development."
      );
      setTransaction(dummyTransaction);
    }
  }, []);

  const handlePrint = async () => {
    // TODO: Implementasikan pembuatan PDF melalui backend di sini.
    // Komentar di bawah ini adalah contoh kerangka untuk implementasi di masa depan.

    /*
    console.log("Memulai proses pembuatan PDF untuk transaksi:", transaction.transaction_id);
    try {
      // 1. Panggil API backend Anda untuk menghasilkan PDF.
      // Ganti URL dengan endpoint API Anda yang sebenarnya.
      const response = await fetch(`https://your-laravel-api.com/api/transactions/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Tambahkan jika perlu otentikasi
        },
        body: JSON.stringify({
          transaction_id: transaction.transaction_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal saat menghubungi server untuk membuat PDF.');
      }

      // 2. Terima file PDF dari backend dan buka di tab baru atau unduh.
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      
      // Buka di tab baru
      window.open(fileURL, '_blank');

      // Atau, untuk mengunduh file secara otomatis:
      // const link = document.createElement('a');
      // link.href = fileURL;
      // link.setAttribute('download', `bukti-transaksi-${transaction.transaction_id}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Gagal membuat bukti transaksi. Silakan coba lagi nanti.");
    }
    */

    // Untuk saat ini, fungsionalitas cetak halaman tetap dipertahankan sebagai placeholder.
    console.log("Fungsionalitas cetak saat ini masih menggunakan window.print(). Ganti logika di atas saat backend siap.");
    window.print();
  };


  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg">
        Memuat data transaksi...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4 font-sans text-gray-800 gradient-bg printable-areav">
        <motion.main
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white/90 backdrop-blur-sm shadow-card rounded-xl">
            {/* 1. Header Pesan Sukses */}
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 bg-green-100 rounded-full">
                <FaCheck className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pembayaran Berhasil!
              </h1>
              <p className="mt-1 text-gray-600">
                Selamat! Kursus Anda sudah aktif dan dapat diakses.
              </p>
            </div>

            {/* 2. Item yang Dibeli */}
            <div className="p-6 text-center border-t border-b border-gray-200">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500">
                ITEM PEMBELIAN
              </h3>
              <div className="mt-2">
                <p className="text-lg font-bold text-gray-900">
                  {transaction.course.name}
                </p>
                <span className="inline-block px-3 py-1 mt-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  Paket: {transaction.plan.name}
                </span>
              </div>
            </div>

            {/* 3. Rincian Pembayaran */}
            <div className="p-6">
              <div className="max-w-sm mx-auto space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatRupiah(transaction.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PPN (11%)</span>
                  <span className="font-medium">
                    {formatRupiah(transaction.tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 text-base font-bold border-t border-gray-200">
                  <span>Total Dibayar</span>
                  <span className="text-blue-600">
                    {formatRupiah(transaction.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Detail Referensi (Collapsible) */}
            <div className="px-6 pb-6 border-t border-gray-200">
              <details>
                <summary className="flex items-center justify-between text-sm font-medium text-gray-600 list-none cursor-pointer hover:text-gray-900">
                  <span>Tampilkan Detail Referensi</span>
                  <FaChevronDown className="transition-transform duration-300 transform details-arrow" />
                </summary>
                <div className="grid grid-cols-1 gap-4 pt-4 mt-4 text-sm border-t border-gray-200 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-gray-500">
                      <FaHashtag /> ID Transaksi
                    </div>
                    <div className="ml-6 font-mono font-semibold text-gray-700">
                      {transaction.transaction_id}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-gray-500">
                      <FaCalendarAlt /> Tanggal Pembayaran
                    </div>
                    <div className="ml-6 font-semibold text-gray-700">
                      {formatDate(transaction.payment_date)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-gray-500">
                      <FaCreditCard /> Metode Pembayaran
                    </div>
                    <div className="ml-6 font-semibold text-gray-700">
                      {transaction.payment_method}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 ml-6 text-gray-500">Status</div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium ml-6">
                      <FaCheck className="w-3 h-3" />
                      Berhasil
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col gap-3 mt-6 sm:flex-row no-print">
            <Link
              href="/my-courses"
              className="w-full text-center gradient-main text-white px-5 py-2.5 rounded-lg font-semibold text-base hover:opacity-90 shadow-button transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaGraduationCap /> Mulai Belajar
            </Link>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto text-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <FaPrint /> Cetak
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto text-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <FaHome /> Beranda
            </Link>
          </div>
        </motion.main>
      </div>
      <style jsx>{`
        details[open] .details-arrow {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}
