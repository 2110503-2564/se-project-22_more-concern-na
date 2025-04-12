import NavBar from '@/components/NavBar';
import { Toaster } from '@/components/ui/sonner';
import NextAuthProvider from '@/providers/NextAuthProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import './globals.css';

export const metadata: Metadata = {
  title: 'MCN: Hotel Booking System',
  description:
    'Hotel booking system for software engineering project (cedt 2025)',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <body>
        <NextAuthProvider session={session}>
          <NavBar />
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
