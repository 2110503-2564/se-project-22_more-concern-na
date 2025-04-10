'use client';

import { BookingCard } from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock booking data
const mockBookings = [
  {
    id: 'book-001',
    hotelName: 'Hotel Name',
    checkInDate: new Date(), // Today
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    location: 'location',
  },
  {
    id: 'book-002',
    hotelName: 'Hotel Name',
    checkInDate: new Date(), // Today
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    location: 'location',
  },
  {
    id: 'book-003',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    location: 'location',
  },
  {
    id: 'book-004',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 23)),
    location: 'location',
  },
  {
    id: 'book-005',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 35)),
    location: 'location',
  },
  {
    id: 'book-006',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 40)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 45)),
    location: 'location',
  },
  // Past bookings
  {
    id: 'book-007',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    location: 'location',
  },
  {
    id: 'book-008',
    hotelName: 'Hotel Name',
    checkInDate: new Date(new Date().setDate(new Date().getDate() - 20)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() - 15)),
    location: 'location',
  },
];

interface Booking {
  id: string;
  hotelName: string;
  checkInDate: Date;
  checkOutDate: Date;
  location: string;
}

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
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Get today's date
    const today = getTodayDate();

    // Filter bookings into the three categories
    const active = mockBookings.filter((booking) => {
      const checkInDate = createDateForComparison(booking.checkInDate);
      const checkOutDate = createDateForComparison(booking.checkOutDate);

      // A booking is active if:
      // 1. Check-in date is today, or
      // 2. Today is between check-in and check-out dates
      return (
        checkInDate.getTime() === today.getTime() ||
        (checkInDate <= today && checkOutDate >= today)
      );
    });

    const upcoming = mockBookings.filter((booking) => {
      const checkInDate = createDateForComparison(booking.checkInDate);
      return checkInDate > today;
    });

    const past = mockBookings.filter((booking) => {
      const checkInDate = createDateForComparison(booking.checkInDate);
      const checkOutDate = createDateForComparison(booking.checkOutDate);

      return checkOutDate < today && checkInDate < today;
    });

    setActiveBookings(active);
    setUpcomingBookings(upcoming);
    setPastBookings(past);
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
          <h2 className='text-2xl font-semibold mb-6'>
            Active Bookings : {activeBookings.length}
          </h2>

          {activeBookings.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  hotelName={booking.hotelName}
                  checkInDate={new Date(booking.checkInDate)}
                  checkOutDate={new Date(booking.checkOutDate)}
                  location={booking.location}
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
            Upcoming Bookings : {upcomingBookings.length}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                hotelName={booking.hotelName}
                checkInDate={new Date(booking.checkInDate)}
                checkOutDate={new Date(booking.checkOutDate)}
                location={booking.location}
                type='upcoming'
              />
            ))}
          </div>
        </section>

        {/* Past Bookings */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>
            Past Bookings : {pastBookings.length}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                hotelName={booking.hotelName}
                checkInDate={new Date(booking.checkInDate)}
                checkOutDate={new Date(booking.checkOutDate)}
                location={booking.location}
                type='past'
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
