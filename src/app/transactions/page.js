import Sidebar from '@/components/Sidebar';

export default function TransactionsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-bold">Transaksi Saya</h1>
        <p className="mt-4">Halaman ini dalam pengembangan.</p>
      </main>
    </div>
  );
}
