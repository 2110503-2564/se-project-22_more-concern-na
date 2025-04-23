'use client';

import { Hotel, LogOut, Settings, Wrench } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function UserBar() {
  const { data: session } = useSession();
  return (
    <div className='flex items-center gap-2 text-white font-number'>
      <Link
        href={'/profile'}
        className='flex items-center gap-2 hover:text-gold-gd1'
      >
        <div className='flex items-center gap-2'>
          <span className='border-2 border-white rounded-full px-2'>P</span>
          <span>{session && (session.user as any)?.data.point}</span>
        </div>
        <span>{session && (session.user as any)?.data.name}</span>
      </Link>
      <button
        onClick={() => signOut()}
        className='hover:text-gold-gd1 cursor-pointer'
      >
        <LogOut />
      </button>
    </div>
  );
}

function DashboardButton({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <Link
      href={link}
      className='flex items-center gap-2 text-white font-heading hover:text-gold-gd1'
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = session !== null;
  let role: 'admin' | 'hotelManager' | 'user' | null;
  role = session ? (session.user as any)?.data.role : null;
  let hotelid: string | null;
  hotelid = session ? (session.user as any)?.data.hotel : null;
  return (
    <nav className='h-16 w-full flex items-center px-4'>
      {role === 'admin' ? (
        <DashboardButton link='/admin'>
          <Wrench />
          Dashboard
        </DashboardButton>
      ) : role === 'hotelManager' ? (
        <DashboardButton link={`/manage/hotels/${hotelid}`}>
          <Settings />
          Manage
        </DashboardButton>
      ) : (
        <DashboardButton link='/hotels'>
          <Hotel />
          View Hotels
        </DashboardButton>
      )}
      <div
        className='h-full flex items-center justify-center grow'
        onClick={() => router.push('/')}
      >
        <Image src={'/mcn-text.png'} alt='MCN Logo' width={150} height={0} className='cursor-pointer' />
      </div>
      {isLoggedIn ? (
        <UserBar />
      ) : (
        <Button variant='golden' onClick={() => signIn()}>
          Login
        </Button>
      )}
    </nav>
  );
}
