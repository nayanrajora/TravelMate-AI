import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TripProvider } from "@/context/TripContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "TravelMate AI - Next-Gen 3D AI Travel Concierge",
  description: "Experience the future of trip planning with TravelMate AI. Featuring 3D globe flight tracking, hyper-personalized AI itineraries, budget analytics, and weather smart-packing.",
  keywords: ["AI Travel Planner", "Next.js 3D Travel", "Interactive Itinerary Generator", "TravelMate AI", "Obsidian Aurora Design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0d1515] text-[#dce4e4] selection:bg-cyan-500 selection:text-slate-950">
        <ThemeProvider>
          <AuthProvider>
            <TripProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
              <Footer />
            </TripProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
