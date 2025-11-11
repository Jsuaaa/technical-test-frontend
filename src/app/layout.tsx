import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/src/core/shared/styles/globals.css";
import "@carbon/styles/css/styles.css";
import ReactQueryProvider from "@/src/core/shared/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Framecore Test",
  description: "Framecore Test",
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
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
