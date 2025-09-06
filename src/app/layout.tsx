import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Adjust path as needed
import { ServiceProvider } from "@/lib/ServiceContext"; // Adjust path if needed

// Configure the sans-serif font: Manrope
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap", // Ensures text is visible while the font loads
  variable: "--font-manrope", // Sets up a CSS variable
});

// Configure the monospaced font: JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "JC Services",
  description: "Tech Services for the Modern World",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <ServiceProvider>{children}</ServiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}