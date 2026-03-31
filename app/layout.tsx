import type { Metadata } from "next";
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
      <body
        className="font-sans antialiased"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 70%, var(--color-background) 100%)",
          color: "var(--color-text-primary)",
        }}
      >
        <SkipToMain />
        <Header />

        <main
          id="main-content"
          className="min-h-screen focus:outline-none"
          style={{
            background:
              "linear-gradient(135deg, var(--color-background) 80%, var(--color-gold) 100%)",
            borderTop: "4px solid var(--color-gold)",
            borderBottom: "4px solid var(--color-gold)",
          }}
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
