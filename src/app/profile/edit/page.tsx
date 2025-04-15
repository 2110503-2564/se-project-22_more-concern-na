'use client';

import { getCurrentUser } from '@/lib/authService';
import { cn } from '@/lib/utils';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUser } from '@/lib/authService';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';


export default function EditProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(undefined);
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setName('');
    setTelephone('');
  }, []);

  const handleChangePicture = () => {
    // Logic to change picture
    console.log('Change picture');
  };

  const handleSaveChanges = async () => {
    const token = (session as any)?.user?.token;
  
    if (!token) {
      alert("Authentication required.");
      signIn();
      return;
    }
  
    try {
      const result = await updateUser({ name, tel: telephone }, token);
  
      if (!result) {
        alert("Server error or invalid response.");
        return;
      }
  
      if (result.success) {
        console.log("Profile updated:", result);
        router.push("/profile");
      } else {
        console.error("Update failed:", result);
        alert(result.msg || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong.");
    }

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
      <div className='w-full max-w-4xl'>
        <div className='p-8 bg-bg-box border border-[#2a3050] shadow-md shadow-black/50 rounded'>
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
              <Button
                className='w-48'
                onClick={handleChangePicture}
                variant='golden'
              >
                Change Picture
              </Button>
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
                  className='bg-bg-placeholder text-black px-4 py-2 rounded border border-bg-border focus:border-[#D2A047] focus:outline-none w-64'
                />
              </div>

              <div className='flex items-center'>
                <label className='text-xl w-32 font-heading'>Telephone</label>
                <input
                  type='tel'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder='Telephone'
                  className='bg-bg-placeholder text-black px-4 py-2 rounded border border-bg-border focus:border-[#D2A047] focus:outline-none w-64'
                />
              </div>
            </div>
          </div>

          {/* Save Changes button */}
          <div className='flex justify-end mt-8'>
            <Button
              className='w-40'
              onClick={handleSaveChanges}
              variant='golden'
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
