'use client';

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import AnimatedContent from "@/components/animatedcontent.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import Toast from "@/components/Toast.jsx";
import SettingsSkeleton from "@/components/SettingsSkeleton.jsx";
import { FaUser, FaLock, FaSave, FaCamera } from "react-icons/fa";
import { getMe, updateMyProfile } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";

const TabButton = ({ label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(label)}
    className={`px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-2.5 font-semibold transition-colors duration-300 -mb-px border-b-2 ${
      activeTab === label
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-800'
    }`}>
    {label}
  </button>
);

export default function SettingsPage() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null); // To track initial fetched data
  const [pageLoading, setPageLoading] = useState(true); // Renamed to avoid conflict
  const [selectedPhoto, setSelectedPhoto] = useState(null); // New state for selected photo
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('Profil');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthLoading && !isLoggedIn) {
        window.location.href = "/login";
        return;
      }
      if (isLoggedIn) {
        try {
          setPageLoading(true);
          const userData = await getMe();
          setUser(userData);
          setOriginalUser(userData); // Store original data
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } finally {
          setPageLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn, isAuthLoading]);

  const isProfileChanged = useMemo(() => {
    if (!user || !originalUser) return false;
    return user.name !== originalUser.name || user.email !== originalUser.email || selectedPhoto !== null;
  }, [user, originalUser, selectedPhoto]);

  const isPasswordFormValid = useMemo(() =>
    passwords.current && passwords.new && passwords.new === passwords.confirm && !errors.confirm,
  [passwords, errors.confirm]);

  const validate = (name, value) => {
    let errorMsg = '';
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      errorMsg = 'Format email tidak valid.';
    } else if (name === 'confirm' && passwords.new !== value) {
      errorMsg = 'Password tidak cocok.';
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'Profil') {
      setUser({ ...user, [name]: value });
    } else {
      setPasswords({ ...passwords, [name]: value });
      validate(name, value);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPhoto(e.target.files[0]);
    } else {
      setSelectedPhoto(null);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    if (section === 'Profil' && !isProfileChanged) return;
    if (section === 'Keamanan' && !isPasswordFormValid) return;
    
    try {
      if (section === 'Profil') {
        const profileData = {
          name: user.name,
          email: user.email,
        };
        if (selectedPhoto) {
          profileData.photo = selectedPhoto;
        }
        const updatedData = await updateMyProfile(profileData);
        setUser(updatedData.user); // Assuming API returns updated user object
        setOriginalUser(updatedData.user);
        setSelectedPhoto(null); // Clear selected photo after successful upload
        showToast('Profil berhasil diperbarui!');
      } else if (section === 'Keamanan') {
        await updateMyProfile({ 
          password: passwords.new, 
          password_confirmation: passwords.confirm 
        });
        showToast('Password berhasil diperbarui!');
        setPasswords({ current: '', new: '', confirm: '' });
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      let errorMessage = `Gagal memperbarui ${section}.`;
      if (error.response && error.response.data) {
        console.log("API Error Response:", error.response); // Log the full error response
        if (error.response.data.errors && typeof error.response.data.errors === 'object') {
          const validationErrors = Object.values(error.response.data.errors)
            .map(fieldErrors => Array.isArray(fieldErrors) ? fieldErrors.join(' ') : String(fieldErrors)) // Ensure fieldErrors is array or convert to string
            .filter(Boolean) // Remove empty strings
            .join('; '); // Join messages from different fields
          errorMessage = validationErrors || error.response.data.message || errorMessage;
        } else if (error.response.data.message) {
          // Handle general error message
          errorMessage = error.response.data.message;
        }
      }
      showToast(errorMessage, 'error');
    }
  };

  if (pageLoading || isAuthLoading || !user) {
    return <SettingsSkeleton />;
  }

  const userPhoto = selectedPhoto ? URL.createObjectURL(selectedPhoto) : (user?.photo ? ensureAbsoluteUrl(user.photo) : "https://via.placeholder.com/80");

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
        <main className="container mx-auto py-8 pb-24 md:pb-8 relative">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="w-full lg:w-80">
              <div className="sticky top-48">
                <Sidebar />
              </div>
            </aside>

            <div className="flex-1">
              <AnimatedContent distance={50} direction="vertical" reverse={true}>
                <div className="mb-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg">Pengaturan Akun</h1>
                  <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Kelola informasi profil, privasi, dan keamanan akun Anda.</p>
                </div>
              </AnimatedContent>

              <div className="border-b-2 border-gray-200 mb-8">
                <div className="flex space-x-2">
                  <TabButton label="Profil" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton label="Keamanan" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
              </div>

              <div key={activeTab}>
                  {activeTab === 'Profil' && (
                    <AnimatedContent>
                      <div className="space-y-8 isolate">
                        <SettingsCard title="Foto Profil" icon={<FaCamera />}>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                              <Image src={userPhoto} alt={user.name || "Foto Profil"} fill className="object-cover object-center" />
                            </div>
                            <div className="text-center sm:text-left">
                              <p className="text-gray-600 mb-3">Gunakan gambar beresolusi tinggi dengan format JPG, atau PNG.</p>
                              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                              <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors">
                                Unggah Foto Baru
                              </label>
                            </div>
                          </div>
                        </SettingsCard>
                        <SettingsCard title="Detail Profil" icon={<FaUser />}>
                          <form onSubmit={(e) => handleSubmit(e, 'Profil')} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                              <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                              <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="text-right pt-2">
                              <button type="submit" disabled={!isProfileChanged} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                                <FaSave className="mr-2" /> Simpan Perubahan
                              </button>
                            </div>
                          </form>
                        </SettingsCard>
                      </div>
                    </AnimatedContent>
                  )}
                  {activeTab === 'Keamanan' && (
                    <AnimatedContent>
                      <SettingsCard title="Ganti Password" icon={<FaLock />}>
                        <form onSubmit={(e) => handleSubmit(e, 'Keamanan')} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                            <input type="password" name="current" value={passwords.current} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                            <input type="password" name="new" value={passwords.new} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                            <input type="password" name="confirm" value={passwords.confirm} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                          </div>
                          <div className="text-right pt-2">
                            <button type="submit" disabled={!isPasswordFormValid} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                              <FaSave className="mr-2" /> Ganti Password
                            </button>
                          </div>
                        </form>
                      </SettingsCard>
                    </AnimatedContent>
                  )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Re-usable SettingsCard component
const SettingsCard = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);
