import { getCourses, getCategories, searchCourses } from "@/lib/apiService";
import CoursesPageClient from "./CoursesPageClient";

export const revalidate = 300; // Revalidate every 5 minutes

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

  const [rawCourses, initialCategories] = await Promise.all([
    coursesDataPromise,
    categoriesDataPromise,
  ]);

  // Format prices for courses
  const initialCourses = rawCourses.map(course => ({
    ...course,
    price: formatCurrency(course.price)
  }));

  return (
    <CoursesPageClient
      initialCourses={initialCourses || []}
      initialCategories={initialCategories || []}
    />
  );
}