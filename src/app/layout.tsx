import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";

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
