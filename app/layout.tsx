import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "../components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/bar/Navbar";
import '@rainbow-me/rainbowkit/styles.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Musang Charity",
  description: "Charity donation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster toastOptions={{ duration: 3000 }} />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
