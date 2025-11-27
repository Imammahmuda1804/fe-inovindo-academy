import { getStats, getPopularCourses, getCategories } from "@/lib/apiService";
import HomePageClient from "./HomePageClient";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers"; // Impor ensureAbsoluteUrl

export const revalidate = 300; // Revalidate every 5 minutes

// Helper function for currency formatting
function formatCurrency(amount) {
  if (typeof amount !== 'number' || amount < 0) return '';
  if (amount === 0) return 'Gratis'; // Explicitly return 'Gratis' for zero price

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  // 1. Ambil semua data secara paralel di server
  const [statsData, popularCoursesPayload, categoriesPayload] =
    await Promise.all([getStats(), getPopularCourses(), getCategories()]);

  // 2. Proses dan transformasi data kursus populer
  const transformedCourses =
    popularCoursesPayload?.data?.map((c) => ({
      image: ensureAbsoluteUrl(c.thumbnail), // Terapkan ensureAbsoluteUrl di sini
      alt: c.name,
      title: c.name,
      author: c.category?.name ? c.category.name : "",
      enrollment: "", // Data tidak tersedia atau tidak digunakan
      price: formatCurrency(c.price), // Sekarang menggunakan harga sebenarnya dari API
      link: `/detail-course/${c.slug}`,
    })) || [];

  // 3. Proses dan transformasi data kategori
  const transformedCategories =
    categoriesPayload
      ?.sort((a, b) => (b.courses_count || 0) - (a.courses_count || 0))
      .slice(0, 6)
      .map((cat) => ({
        icon: cat.icon,
        title: cat.name,
        courses: `${cat.courses_count || 0} Courses`,
      })) || [];

  // 4. Kirim data yang sudah jadi ke komponen klien sebagai props
  return (
    <HomePageClient
      initialStats={statsData || {}}
      initialPopularCourses={transformedCourses}
      initialCategories={transformedCategories}
    />
  );
}