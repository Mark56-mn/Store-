import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Storefront",
  description: "A secure and beautiful storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#020617] text-slate-100 antialiased relative overflow-x-hidden`}>
        {/* Background Mesh Gradients */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed top-[20%] right-[10%] w-[30vw] h-[30vh] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
