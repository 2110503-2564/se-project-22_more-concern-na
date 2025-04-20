'use client';
import { BookingCard } from '@/components/BookingCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authService';
import { checkInBooking, getBookings } from '@/lib/bookingService';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  BookingResponse,
  IUser,
  PBooking,
  UserRole,
} from '../../../../interface';

export default function ManageBookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingsData, setBookingsData] = useState<BookingResponse | null>(
    null,
  );
  const [allBookings, setAllBookings] = useState<PBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const token = (session as any)?.token;

  const isAdmin = userRole === 'admin';
  const isHotelManager = userRole === 'hotelManager';
  const isAuthorized = isAdmin || isHotelManager;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getCurrentUser(token);
        if (userResponse && userResponse.success) {
          setUserData(userResponse);
          setUserRole(userResponse.role as UserRole);
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data');
      }
    };

    fetchUserData();
  }, [session, status]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setIsLoading(true);

        const response = await getBookings(undefined, token);
        setBookingsData(response);
        console.log('Bookings data:', response);

        // Combine all bookings for admin/manager view
        const combinedBookings = [
          ...(response.active?.data || []),
          ...(response.upcoming?.data || []),
          ...(response.past?.data || []),
        ].map((booking) => ({
          ...booking,
          checkedIn: booking.status === 'checkedIn',
        }));

        setAllBookings(combinedBookings);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchAllBookings();
    }
  }, [session, status, isAuthorized]);

  const handleGoBack = () => {
    router.back();
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const response = await checkInBooking(bookingId, token);
      console.log('Check-in response:', response);
      setAllBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'checkedIn' }
            : booking,
        ),
      );

      toast.success('Guest checked in successfully');
    } catch (err: any) {
      console.error('Error checking in guest:', err);
      toast.error('Failed to check in guest');
    }
  };

  const getBookingType = (booking: PBooking) => {
    const today = dayjs().startOf('day');
    const checkInDate = dayjs(booking.startDate).startOf('day');
    const checkOutDate = dayjs(booking.endDate).startOf('day');

    if (
      today.isSame(checkInDate) ||
      (today.isAfter(checkInDate) && today.isBefore(checkOutDate)) ||
      today.isSame(checkOutDate)
    ) {
      return 'active';
    } else if (today.isBefore(checkInDate)) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

  const getDaysUntil = (booking: PBooking) => {
    const today = dayjs().startOf('day');
    const checkInDate = dayjs(booking.startDate).startOf('day');

    if (checkInDate.isAfter(today)) {
      return checkInDate.diff(today, 'day');
    }

    return undefined;
  };

  if (isLoading || status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
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
            Back to Admin Dashboard
          </Button>
        </div>

        {/* Page Title */}
        <div className='mb-10'>
          <h1 className='text-5xl font-bold font-heading'>Manage Bookings</h1>
          <p className='text-gray-400 mt-1'>Manage bookings listings</p>
        </div>

        {/* Bookings List */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {allBookings.length > 0 ? (
            allBookings.map((booking) => {
              const bookingType = getBookingType(booking);
              const daysUntil =
                bookingType === 'upcoming' ? getDaysUntil(booking) : undefined;

              return (
                <BookingCard
                  key={booking._id}
                  id={booking._id}
                  hotelName={booking.hotel.name}
                  checkInDate={new Date(booking.startDate)}
                  checkOutDate={new Date(booking.endDate)}
                  location={`${booking.hotel.street}, ${booking.hotel.district}, ${booking.hotel.province} ${booking.hotel.postalCode}`}
                  type={bookingType}
                  daysUntil={daysUntil}
                  checkedIn={booking.status === 'checkedIn'}
                  showCheckInOption={
                    isHotelManager &&
                    bookingType === 'active' &&
                    booking.status !== 'checkedIn'
                  }
                  onCheckIn={handleCheckIn}
                />
              );
            })
          ) : (
            <div className='col-span-2 text-center py-10'>
              <p className='text-gray-400'>No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
