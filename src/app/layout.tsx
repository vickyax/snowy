import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Adjust path as needed
import { ServiceProvider } from "@/lib/ServiceContext"; // Adjust path if needed
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JC Services",
  description: "Tech Services for the Modern World",
  
};

export default function RootLayout(
  { children }: { children: React.ReactNode}) {
    
  
  return (
    <html lang="en">
      <head>
    <link rel="icon" href="/favicon.ico" type="image/png" style={{ borderRadius: "50%"}}/>
    {/* ...other head tags... */}
  </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <ServiceProvider>
          {children}
          </ServiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
