"use client";
import { usePathname } from 'next/navigation';
import Footer from '../components/footer';

export function AppBody({ children }) {
    const pathname = usePathname();
    const isMateriPage = pathname.startsWith('/materi');

    return (
        <>
            {children}
            {!isMateriPage && <Footer />}
        </>
    );
}
