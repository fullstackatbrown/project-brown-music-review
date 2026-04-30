import type { Metadata } from "next";
import { Inter, Bowlby_One } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bowlbyOne = Bowlby_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bowlby",
});

export const metadata: Metadata = {
  title: "Brown Music Review",
  description: "Brown Music Review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bowlbyOne.variable} antialiased bg-white text-black font-sans`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
