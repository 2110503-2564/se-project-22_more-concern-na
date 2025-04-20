'use client';

import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authService';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [active, setActive] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [past, setPast] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(undefined);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const token = (session as any)?.user?.token;

  useEffect(() => {
    if (!session) {
      signIn();
      return;
    }

    const fetchUser = async () => {
      const user = await getCurrentUser(token);
      console.log(user);
      setUserProfile(user);
      setLoading(false);

      try {
        const activeCount = user.bookings.active.count;
        const upcomingCount = user.bookings.upcoming.count;
        const pastCount = user.bookings.past.count;

        setActive(activeCount);
        setUpcoming(upcomingCount);
        setPast(pastCount);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchUser();
  }, []);

  const handleInventoryClick = () => {
    router.push('/redemption');
  };

  const handleEditProfileClick = () => {
    router.push('/profile/edit');
  };

  const handleManageBookingsClick = () => {
    router.push('/bookings');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <main className='flex flex-col items-center p-8 bg-base-gd min-h-screen text-white'>
      {/* Profile content */}
      <div className='w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-bold font-heading ml-15'>
            Your Profile
          </h1>
          <Button
            className='w-40'
            onClick={handleInventoryClick}
            variant='golden'
          >
            Your Inventory
          </Button>
        </div>
        {userProfile && (
          <div className='p-6 bg-[#161D30] border border-[#2a3050] shadow-md shadow-black/50 rounded'>
            <div className='flex flex-wrap'>
              {/* Profile section with picture and user info */}
              <div className='flex flex-wrap mr-8'>
                {/* Left column - picture and button */}
                <div className='flex flex-col items-center'>
                  <img src='/defaultUser.jpg' alt='user picture' className='w-48 h-64 bg-gray-200 text-gray-800 flex items-center justify-center border-4 border-[#D2A047] mb-7'/>
                  <Button
                    className='w-48'
                    onClick={handleEditProfileClick}
                    variant='golden'
                  >
                    Edit Profile
                  </Button>
                </div>

                {/* Right column - user info */}
                <div className='flex flex-col justify-center ml-6 font-details'>
                  <p className='text-xl mb-6'>Name : {userProfile.name}</p>
                  <p className='text-xl mb-6'>Email : {userProfile.email}</p>
                  <p className='text-xl mb-6'>Tel : {userProfile.tel} </p>
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
                    <Button
                      className='w-full h-10'
                      onClick={handleManageBookingsClick}
                      variant='golden'
                    >
                      Manage Bookings
                    </Button>
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
