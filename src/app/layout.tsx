import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MCN: Hotel Booking System',
  description:
    'Hotel booking system for software engineering project (cedt 2025)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
