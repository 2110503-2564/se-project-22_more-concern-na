'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Lock, User, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const [active, setActive] = useState(1);
  const [upcoming, setUpcoming] = useState(4);
  const [past, setPast] = useState(2);

  useEffect(() => {
    // Fetch user profile and booking data
  }, []);

  const buttonClass = `
  relative bg-gradient-to-r from-[#E1C582] to-[#D2A047] text-black 
  hover:text-[#E1C582] hover:bg-[#161D30] 
  transition-all duration-300
  before:absolute before:inset-0 before:p-0.5
  before:bg-gradient-to-r before:from-[#E1C582] before:to-[#D2A047] 
  before:opacity-0 hover:before:opacity-100 before:transition-opacity
  overflow-hidden
  flex justify-center items-center cursor-pointer
`;

const buttonInnerClass = `
  relative z-10 bg-inherit px-4 py-2 
  hover:bg-[#161D30] transition-colors duration-300
  flex justify-center items-center w-full h-full
`;

return (
  <main className='flex flex-col items-center p-8 bg-[#16192b] min-h-screen text-white'>
    
    <div className='flex justify-between w-full max-w-4xl mb-8'>
      <h1 className='text-4xl font-bold'>Your Profile</h1>
      <div className={buttonClass}>
        <div className={buttonInnerClass}>Your Inventory</div>
      </div>
    </div>

    <div className='w-full max-w-4xl'>
      <div className='p-6 bg-[#1e2341] border border-[#2a3050] mb-6'>
        <div className='flex gap-6'>
          <div className='w-36 h-48 bg-gray-200 text-gray-800 flex items-center justify-center border-2 border-[#D2A047]'>
            picture
          </div>
          <div className='flex flex-col justify-center'>
            <p className='text-xl mb-2'>Name : </p>
            <p className='text-xl mb-2'>Email : </p>
            <p className='text-xl mb-2'>Telephone : </p>
            <div className={`${buttonClass} mt-4 w-32 h-10`}>
              <div className={buttonInnerClass}>Edit Profile</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='p-10 bg-[#1e2341] border border-[#2a3050] w-full'>
        <h2 className='text-2xl font-bold text-center mb-6'>Your Bookings</h2>
        
        <div className='w-full max-w-xs mx-auto'>
          <div className='flex justify-between mb-4'>
            <p>Active</p>
            <p className='font-bold'>{active}</p>
          </div>
          <div className='flex justify-between mb-4'>
            <p>Upcoming</p>
            <p className='font-bold'>{upcoming}</p>
          </div>
          <div className='flex justify-between mb-6'>
            <p>Past</p>
            <p className='font-bold'>{past}</p>
          </div>
          <hr className='border-gray-600 my-6' />
          <div className='flex justify-between font-bold mb-6'>
            <p>Total</p>
            <p>{active + upcoming + past}</p>
          </div>
          <div className='flex justify-center'>
            <div className={`${buttonClass} w-40 h-10`}>
              <div className={buttonInnerClass}>Manage Bookings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
