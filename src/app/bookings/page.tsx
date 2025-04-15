'use client';

import { BookingCard } from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { getBookings } from '@/lib/bookingService';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PBooking } from '../../../interface';

// Get today's date with dayjs, set to start of day
const getTodayDate = () => {
  return dayjs().startOf('day');
};

// Create a date for comparison using dayjs
const createDateForComparison = (date: string) => {
  return dayjs(date).startOf('day');
};

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingsData, setBookingsData] = useState<{
    success: boolean;
    past?: { pagination?: { count?: number }; data?: PBooking[] };
    active?: { pagination?: { count?: number }; data?: PBooking[] };
    upcoming?: { pagination?: { count?: number }; data?: PBooking[] };
    msg?: string;
  }>({ success: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = (session as any)?.user?.token;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await getBookings(undefined, token);
        console.log('Bookings response:', response);
        setBookingsData(response);
        console.log('Bookings data:', bookingsData);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

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
          <h2 className='text-2xl font-semibold mb-6 font-heading'>
            Active Bookings : {bookingsData?.active?.pagination?.count || 0}
          </h2>

          {bookingsData?.active?.data && bookingsData.active.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.active.data.map((booking, index) => (
                <BookingCard
                  key={`active-${index}`}
                  id={booking._id}
                  hotelName={booking.hotel.name}
                  checkInDate={dayjs(booking.startDate).toDate()}
                  checkOutDate={dayjs(booking.endDate).toDate()}
                  location={`${booking.hotel.street}, ${booking.hotel.district}, ${booking.hotel.postalCode}`}
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
          <h2 className='text-2xl font-semibold mb-6 font-heading'>
            Upcoming Bookings : {bookingsData?.upcoming?.pagination?.count || 0}
          </h2>

          {bookingsData?.upcoming?.data &&
          bookingsData.upcoming.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.upcoming.data.map((booking, index) => {
                const today = getTodayDate();
                const checkInDate = createDateForComparison(booking.startDate);
                const daysUntil = checkInDate.diff(today, 'day');

                return (
                  <BookingCard
                    key={`upcoming-${index}`}
                    id={booking._id}
                    hotelName={booking.hotel.name}
                    checkInDate={dayjs(booking.startDate).toDate()}
                    checkOutDate={dayjs(booking.endDate).toDate()}
                    location={`${booking.hotel.street}, ${booking.hotel.district}, ${booking.hotel.postalCode}`}
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
          <h2 className='text-2xl font-semibold mb-6 font-heading'>
            Past Bookings : {bookingsData?.past?.pagination?.count || 0}
          </h2>

          {bookingsData?.past?.data && bookingsData.past.data.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bookingsData.past.data.map((booking, index) => (
                <BookingCard
                  key={`past-${index}`}
                  id={booking._id}
                  hotelName={booking.hotel.name}
                  checkInDate={dayjs(booking.startDate).toDate()}
                  checkOutDate={dayjs(booking.endDate).toDate()}
                  location={`${booking.hotel.street}, ${booking.hotel.district}, ${booking.hotel.postalCode}`}
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
