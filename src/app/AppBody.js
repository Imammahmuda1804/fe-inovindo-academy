"use client";
import { usePathname } from "next/navigation";
import Footer from "../components/footer";
import Header from "../components/header";

export function AppBody({ children }) {
  const pathname = usePathname();

  const standalonePages = ["/payment-success", "/landing-page", "/login"];
  const isStandalone = standalonePages.includes(pathname);
  const noFooterPages = pathname.startsWith("/materi");

  if (isStandalone) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      {!noFooterPages && <Footer />}
    </>
  );
}
