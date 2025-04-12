'use client';

import { BookingCard } from '@/components/BookingCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { getBookings } from '@/lib/bookingService';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookingData, BookingResponse } from '../../../interface';

// Function to get today's date with time set to midnight
const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Function to create a date for comparison (without time component)
const createDateForComparison = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingsData, setBookingsData] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not logged in, redirect to login page
    if (status === 'unauthenticated') {
      router.push('/api/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (status !== 'authenticated' || !session) return;
      
      try {
        setIsLoading(true);
        // Get token from session
        const token = (session as any)?.token;
        
        // Fetch bookings from backend
        const response = await getBookings(undefined, token);
        setBookingsData(response);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchBookings();
    }
  }, [session, status]);

  const handleGoBack = () => {
    router.push('/profile');
  };

  // Display loading state
  if (isLoading || status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className='container mx-auto px-4 py-6 text-white'>
        <div className='text-center py-10'>
          <h2 className='text-2xl font-semibold mb-4'>Error Loading Bookings</h2>
          <p className='text-gray-400 mb-6'>{error}</p>
          <Button variant='bluely' onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='text-white font-detail'>
      {/* Main Content */}
      <div className='container mx-auto px-4 py-6'>
        {/* Back Navigation */}
        <div className='mb-8'>
          <Button
            variant='link'
            onClick={handleGoBack}
            className='text-gray-400 hover:text-white cursor-pointer'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Your Profile
          </Button>
        </div>

        {/* Page Title */}
        <div className='mb-10'>
          <h1 className='text-4xl font-bold font-heading'>Manage Bookings</h1>
          <p className='text-gray-400 mt-1'>Manage your bookings</p>
        </div>

        {/* Active Bookings */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>
            Active Bookings : {bookingsData?.active?.data?.length || 0}
          </h2>

          {bookingsData?.active?.data && bookingsData.active.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.active.data.map((booking, index) => (
                <BookingCard
                  key={`active-${index}`}
                  id={`booking-${index}`}
                  hotelName={booking.hotelName}
                  checkInDate={new Date(booking.startDate)}
                  checkOutDate={new Date(booking.endDate)}
                  location={booking.address}
                  type='active'
                />
              ))}
            </div>
          ) : (
            <p className='text-gray-400'>No active bookings</p>
          )}
        </section>

        {/* Upcoming Bookings */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>
            Upcoming Bookings : {bookingsData?.upcoming?.data?.length || 0}
          </h2>

          {bookingsData?.upcoming?.data && bookingsData.upcoming.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.upcoming.data.map((booking, index) => {
                // Calculate days until check-in
                const today = getTodayDate();
                const checkInDate = createDateForComparison(new Date(booking.startDate));
                const daysUntil = Math.ceil(
                  (checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
                );
                
                return (
                  <BookingCard
                    key={`upcoming-${index}`}
                    id={`booking-${index}`}
                    hotelName={booking.hotelName}
                    checkInDate={new Date(booking.startDate)}
                    checkOutDate={new Date(booking.endDate)}
                    location={booking.address}
                    type='upcoming'
                    daysUntil={daysUntil}
                  />
                );
              })}
            </div>
          ) : (
            <p className='text-gray-400'>No upcoming bookings</p>
          )}
        </section>

        {/* Past Bookings */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>
            Past Bookings : {bookingsData?.past?.data?.length || 0}
          </h2>

          {bookingsData?.past?.data && bookingsData.past.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.past.data.map((booking, index) => (
                <BookingCard
                  key={`past-${index}`}
                  id={`booking-${index}`}
                  hotelName={booking.hotelName}
                  checkInDate={new Date(booking.startDate)}
                  checkOutDate={new Date(booking.endDate)}
                  location={booking.address}
                  type='past'
                />
              ))}
            </div>
          ) : (
            <p className='text-gray-400'>No past bookings</p>
          )}
        </section>
      </div>
    </div>
  );
}