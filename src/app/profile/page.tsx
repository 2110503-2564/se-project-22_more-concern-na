'use client';

import { getCurrentUser } from '@/lib/authService';
import { cn } from '@/lib/utils';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [active, setActive] = useState(1);
  const [upcoming, setUpcoming] = useState(4);
  const [past, setPast] = useState(2);
  const [userProfile, setUserProfile] = useState<any>(undefined);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      signIn();
      return;
    }

    const fetchUser = async () => {
      const user = await getCurrentUser((session as any)?.user?.token);
      console.log(user);
      setUserProfile(user);
    };
    fetchUser();
  }, []);

  const buttonClass = `
  relative bg-gradient-to-r from-gold-gd1 to-gold-gd2 text-black 
  hover:text-[#161D30]
  transition-all duration-300
  before:absolute before:inset-0 before:p-0.5
  before:bg-gradient-to-l before:from-gold-gd1 before:to-gold-gd2 
  before:opacity-0 hover:before:opacity-100 before:transition-opacity
  overflow-hidden
  flex justify-center items-center cursor-pointer
  rounded-lg
`;

  const buttonInnerClass = `
  relative z-10 bg-inherit px-4 py-2 
  hover:bg-gradient-to-r hover:from-gold-gd2 hover:to-gold-gd1
  transition-colors duration-300
  flex justify-center items-center w-full h-full
  rounded-lg
`;

  const handleInventoryClick = () => {
    router.push('/redemption');
  };

  const handleEditProfileClick = () => {
    router.push('/profile/edit');
  };

  const handleManageBookingsClick = () => {
    router.push('/bookings');
  };

  return (
    <main className='flex flex-col items-center p-8 bg-base-gd min-h-screen text-white'>
      {/* Profile content */}
      <div className='w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-bold font-heading ml-15'>
            Your Profile
          </h1>
          <div
            className={cn(buttonClass, 'w-40')}
            onClick={handleInventoryClick}
            role='button'
            tabIndex={0}
            aria-label='Your Inventory'
          >
            <div className={cn(buttonInnerClass)}>Your Inventory</div>
          </div>
        </div>
        {userProfile && (
          <div className='p-6 bg-[#161D30] border border-[#2a3050] shadow-md shadow-black/50 rounded'>
            <div className='flex flex-wrap'>
              {/* Profile section with picture and user info */}
              <div className='flex flex-wrap mr-8'>
                {/* Left column - picture and button */}
                <div className='flex flex-col items-center'>
                  <div className='w-48 h-64 bg-gray-200 text-gray-800 flex items-center justify-center border-4 border-[#D2A047] mb-7'>
                    picture
                  </div>
                  <div
                    className={cn(buttonClass, 'w-48')}
                    onClick={handleEditProfileClick}
                    role='button'
                    tabIndex={0}
                    aria-label='Edit Profile'
                  >
                    <div className={cn(buttonInnerClass)}>Edit Profile</div>
                  </div>
                </div>

                {/* Right column - user info */}
                <div className='flex flex-col justify-center ml-6 font-details'>
                  <p className='text-xl mb-6'>Name : {userProfile.data.name}</p>
                  <p className='text-xl mb-6'>
                    Email : {userProfile.data.email}
                  </p>
                  <p className='text-xl mb-6'>Tel : {userProfile.data.tel} </p>
                </div>
              </div>

              {/* Bookings info section */}
              <div className='w-64 ml-auto'>
                <h2 className='text-2xl font-bold mb-9 font-heading text-center'>
                  Your Bookings
                </h2>

                <div className='w-full text-l'>
                  <div className='flex justify-between mb-6 font-details'>
                    <p>Active</p>
                    <p className='font-bold'>{active}</p>
                  </div>
                  <div className='flex justify-between mb-6'>
                    <p>Upcoming</p>
                    <p className='font-bold'>{upcoming}</p>
                  </div>
                  <div className='flex justify-between mb-8'>
                    <p>Past</p>
                    <p className='font-bold'>{past}</p>
                  </div>

                  <div className='flex justify-between font-bold mt-4 mb-10'>
                    <p>Total</p>
                    <p>{active + upcoming + past}</p>
                  </div>

                  <div className='flex justify-center'>
                    <div
                      className={cn(buttonClass, 'w-full h-10')}
                      onClick={handleManageBookingsClick}
                      role='button'
                      tabIndex={0}
                      aria-label='Manage Bookings'
                    >
                      <div className={cn(buttonInnerClass)}>
                        Manage Bookings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
