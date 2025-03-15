import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Logger",
  description: "Track your meals, rate dishes, and complete challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <AuthProvider>
          <main className="container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
