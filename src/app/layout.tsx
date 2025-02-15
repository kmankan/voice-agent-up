import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
import { ZapSpinner } from '@/components/ui/ZapSpinner';
import Link from 'next/link';
import { ConsoleLogger } from '@/app/components/main/ConsoleLogger';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Up Bank Assistant",
  description: "An Assistant for understanding Up Bank and an API interface for interacting with your account",
  icons: {
    icon: '/up.ico',
  },
};

const circular = localFont({
  src: [
    {
      path: './fonts/CircularStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/CircularStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/CircularStd-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-circular',
  display: 'swap',
})

const apercuMono = localFont({
  src: [
    {
      path: './fonts/apercu-mono-bold-pro.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-apercu-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${circular.variable} ${apercuMono.variable} antialiased`}
      >
        <div className="fixed top-4 left-4">
          <Link href="/">
            <ZapSpinner />
          </Link>
        </div>
        {children}
        <ConsoleLogger />
      </body>
    </html>
  );
}
