'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const router = useRouter();

  useEffect(() => {
    setName('');
    setTelephone('');
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

  const handleChangePicture = () => {
    // Logic to change picture
    console.log('Change picture');
  };

  const handleSaveChanges = () => {
    // Logic to save profile changes
    console.log('Save changes', { name, telephone });
    router.push('/profile');
  };

  return (
    <main className='flex flex-col items-center p-8 bg-base-gd min-h-screen text-white'>
      <div className='w-full max-w-4xl'>
        <div className='p-8 bg-[#161D30] border border-[#2a3050] shadow-md shadow-black/50 rounded'>
          <h1 className='text-4xl font-bold font-heading mb-2'>Edit Profile</h1>
          <p className='text-gray-400 mb-8 ml-3'>
            Make changes to your profile here. Click save when you're done.
          </p>

          <div className='flex flex-wrap'>
            {/* Left column - picture and button */}
            <div className='flex flex-col items-center mr-16'>
              <div className='w-48 h-64 bg-gray-200 text-gray-800 flex items-center justify-center border-4 border-[#D2A047] mb-4'>
                picture
              </div>
              <div
                className={cn(buttonClass, 'w-48')}
                onClick={handleChangePicture}
                role='button'
                tabIndex={0}
                aria-label='Change Picture'
              >
                <div className={cn(buttonInnerClass)}>Change Picture</div>
              </div>
            </div>

            {/* Right column - form fields */}
            <div className='flex-1 flex flex-col justify-center space-y-8'>
              <div className='flex items-center'>
                <label className='text-xl w-32 font-heading'>Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Name'
                  className='bg-[#161D30] text-white px-4 py-2 rounded border border-[#2a3050] focus:border-[#D2A047] focus:outline-none w-64'
                />
              </div>

              <div className='flex items-center'>
                <label className='text-xl w-32 font-heading'>Telephone</label>
                <input
                  type='tel'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder='Telephone'
                  className='bg-[#161D30] text-white px-4 py-2 rounded border border-[#2a3050] focus:border-[#D2A047] focus:outline-none w-64'
                />
              </div>
            </div>
          </div>

          {/* Save Changes button */}
          <div className='flex justify-end mt-8'>
            <div
              className={cn(buttonClass, 'w-40')}
              onClick={handleSaveChanges}
              role='button'
              tabIndex={0}
              aria-label='Save Changes'
            >
              <div className={cn(buttonInnerClass)}>Save Changes</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
