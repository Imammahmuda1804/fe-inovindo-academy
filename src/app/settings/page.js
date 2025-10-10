import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="mt-4">Halaman ini dalam pengembangan.</p>
      </main>
    </div>
  );
}
