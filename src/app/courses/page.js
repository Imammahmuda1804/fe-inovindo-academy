import { getCourses, getCategories, searchCourses } from "@/lib/apiService";
import CoursesPageClient from "./CoursesPageClient";



function formatCurrency(amount) {
  if (typeof amount !== 'number' || amount < 0) return '';
  if (amount === 0) return 'Gratis';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function CoursesPage({ searchParams }) {
  const query = searchParams?.search;

  const coursesDataPromise = query ? searchCourses(query) : getCourses({});
  const categoriesDataPromise = getCategories();

  const [initialCourses, initialCategories] = await Promise.all([
    coursesDataPromise,
    categoriesDataPromise,
  ]);

  return (
    <CoursesPageClient
      initialCourses={initialCourses || []}
      initialCategories={initialCategories || []}
    />
  );
}
