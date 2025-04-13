'use client';

import { BookingCard } from '@/components/BookingCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { getBookings } from '@/lib/bookingService';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Booking, BookingResponse, UserRole } from '../../../../interface';

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

interface ExtendedBooking extends Booking {
  _id?: string;
  checkedIn?: boolean;
}

export default function ManageBookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingsData, setBookingsData] = useState<BookingResponse | null>(null);
  const [allBookings, setAllBookings] = useState<ExtendedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user role from session
  const userRole = (session?.user as any)?.data?.role as UserRole;
  const isAdmin = userRole === 'admin';
  const isHotelManager = userRole === 'hotelManager';
  const isAuthorized = isAdmin || isHotelManager;

  useEffect(() => {
    // If not logged in or not authorized, redirect
    if (status === 'unauthenticated' || (status === 'authenticated' && !isAuthorized)) {
      router.push('/api/auth/login');
    }
  }, [status, isAuthorized, router]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (status !== 'authenticated' || !isAuthorized) return;
      
      try {
        setIsLoading(true);
        // Get token from session
        const token = (session as any)?.token;
        
        // Fetch all bookings from backend
        const response = await getBookings(undefined, token);
        setBookingsData(response);
        
        // Combine all bookings for admin/manager view
        const combinedBookings = [
          ...(response.active?.data || []),
          ...(response.upcoming?.data || []),
          ...(response.past?.data || [])
        ].map(booking => ({
          ...booking,
          _id: (booking as any)._id || `booking-${Math.random().toString(36).substr(2, 9)}`,
          checkedIn: (booking as any).checkedIn || false
        }));
        
        setAllBookings(combinedBookings);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (session && isAuthorized) {
      fetchAllBookings();
    }
  }, [session, status, isAuthorized]);

  const handleGoBack = () => {
    router.push('/admin');
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      // We're handling the check-in status only in the frontend
      // since the API doesn't support a 'status' field in the update
      
      // Update local state to reflect the change
      setAllBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, checkedIn: true } 
            : booking
        )
      );
      
      toast.success('Guest checked in successfully');
      
    } catch (err: any) {
      console.error('Error checking in guest:', err);
      toast.error('Failed to check in guest');
    }
  };

  // Determine booking type based on dates
  const getBookingType = (booking: Booking) => {
    const today = getTodayDate();
    const checkInDate = createDateForComparison(new Date(booking.startDate));
    const checkOutDate = createDateForComparison(new Date(booking.endDate));
    
    if (today >= checkInDate && today <= checkOutDate) {
      return 'active';
    } else if (today < checkInDate) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

  // Calculate days until check-in for upcoming bookings
  const getDaysUntil = (booking: Booking) => {
    const today = getTodayDate();
    const checkInDate = createDateForComparison(new Date(booking.startDate));
    
    if (checkInDate > today) {
      return Math.ceil(
        (checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      );
    }
    
    return undefined;
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

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className='container mx-auto px-4 py-6 text-white'>
        <div className='text-center py-10'>
          <h2 className='text-2xl font-semibold mb-4'>Access Denied</h2>
          <p className='text-gray-400 mb-6'>You don't have permission to access this page</p>
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
              const daysUntil = bookingType === 'upcoming' ? getDaysUntil(booking) : undefined;
              
              return (
                <BookingCard
                  key={booking._id}
                  id={booking._id || ''}
                  hotelName={booking.hotelName}
                  checkInDate={new Date(booking.startDate)}
                  checkOutDate={new Date(booking.endDate)}
                  location={booking.address}
                  type={bookingType}
                  daysUntil={daysUntil}
                  checkedIn={booking.checkedIn}
                  showCheckInOption={isHotelManager}
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