import Image from 'next/image';
import { Button } from './ui/button';

function UserBar() {
  return <>UserBar</>;
}

function DashboardButton({ children }: { children: React.ReactNode }) {
  return <div className='flex'>{children}</div>;
}

export default function NavBar() {
  const isLoggedIn = false;
  let role: 'admin' | 'hotelManager' | 'user' | null;
  role = 'admin';
  return (
    <nav className='h-16 w-full flex items-center px-2'>
      {role === 'admin' ? (
        <DashboardButton>Admin</DashboardButton>
      ) : role === 'hotelManager' ? (
        <DashboardButton>Hotel Manager</DashboardButton>
      ) : (
        <DashboardButton>User</DashboardButton>
      )}
      <div className='h-full flex items-center justify-center grow'>
        <Image src={'/mcn-text.png'} alt='MCN Logo' width={150} height={0} />
      </div>
      {isLoggedIn ? <UserBar /> : <Button variant='golden'>Login</Button>}
    </nav>
  );
}
