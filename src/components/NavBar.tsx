import { Hotel, LogOut, Settings, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

function UserBar() {
  return (
    <div className='flex items-center gap-2 text-white font-number'>
      <div className='flex items-center gap-2'>
        <span className='border-2 border-white rounded-full px-2'>P</span>
        <span>150</span>
      </div>
      <Link href={'/logout'}>
        <LogOut />
      </Link>
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
  const isLoggedIn = true;
  let role: 'admin' | 'hotelManager' | 'user' | null;
  role = 'admin';
  return (
    <nav className='h-16 w-full flex items-center px-4'>
      {role === 'admin' ? (
        <DashboardButton link='/admin/report'>
          <Settings />
          Manage
        </DashboardButton>
      ) : role === 'hotelManager' ? (
        <DashboardButton link='/hotels'>
          <Wrench />
          Dashboard
        </DashboardButton>
      ) : (
        <DashboardButton link='/hotels'>
          <Hotel />
          View Hotels
        </DashboardButton>
      )}
      <div className='h-full flex items-center justify-center grow'>
        <Image src={'/mcn-text.png'} alt='MCN Logo' width={150} height={0} />
      </div>
      {isLoggedIn ? <UserBar /> : <Button variant='golden'>Login</Button>}
    </nav>
  );
}
