import Head from "next/head";
import type { Metadata } from "next";
import localFont from "next/font/local";

import Navbar from "@/components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

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
  title: "Grab Profiles",
  description: "Generated for scrape profile data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Head>
          <title>Web Scraper</title>
          <meta name="description" content="Scrape product data easily" />
        </Head>

        <main>
          <div className="flex flex-col w-full h-screen">
            <Navbar />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </main>
      </body>
    </html>
  );
}
