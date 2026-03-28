import type { Metadata } from "next";
import "../node_modules/maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToMain from "@/components/SkipToMain";

export const metadata: Metadata = {
  title: "Christian Study Guide Studies | Deepen Your Walk with Christ",
  description:
    "Free Bible studies, daily devotionals, and resources to grow in faith.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#f8fafc] text-[#1f2937] antialiased">
        <SkipToMain />
        <Header />

        <main id="main-content" className="min-h-screen focus:outline-none">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
