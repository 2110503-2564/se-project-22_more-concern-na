'use client';

import AlertConfirmation from '@/components/AlertConfirmation';
import DateBookFill from '@/components/DateBookFill';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/authService';
import { deleteBooking, getBooking, updateBooking } from '@/lib/bookingService';
import { getHotel } from '@/lib/hotelService';
import dayjs from 'dayjs';
import { ArrowLeft, MapPin, Phone, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingid: string }>;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [booking, setBooking] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For editing dates
  const [isEditing, setIsEditing] = useState(false);
  const [newCheckInDate, setNewCheckInDate] = useState<dayjs.Dayjs | null>(
    null,
  );
  const [newCheckOutDate, setNewCheckOutDate] = useState<dayjs.Dayjs | null>(
    null,
  );

  // For confirmation dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Status calculation
  const getBookingStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(booking?.startDate);
    checkInDate.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(booking?.endDate);
    checkOutDate.setHours(0, 0, 0, 0);

    if (today >= checkInDate && today <= checkOutDate) {
      return 'Active';
    } else if (today < checkInDate) {
      return 'Upcoming';
    } else {
      return 'Completed';
    }
  };

  useEffect(() => {
    // If not logged in, redirect to login page
    if (status === 'unauthenticated') {
      router.push('/api/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (status !== 'authenticated' || !session) return;

      try {
        setIsLoading(true);
        const token = (session as any)?.token;

        // Fetch booking details from API
        const resolveParams = await params;
        const bookinngId = resolveParams.bookingid;
        const bookingData = await getBooking(bookinngId, token);
        setBooking(bookingData);

        // Initialize date states for editing
        if (bookingData) {
          setNewCheckInDate(dayjs(bookingData.startDate));
          setNewCheckOutDate(dayjs(bookingData.endDate));

          // Fetch hotel details if we have hotelId
          if (bookingData.hotelName) {
            const hotelData = await getHotel(bookingData.hotelName);
            setHotel(hotelData);
          }

          // Set user info from session
          setUser(getCurrentUser);
        }
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchBookingDetails();
    }
  }, [params, session, status]);

  const handleBack = () => {
    router.push('/bookings');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!newCheckInDate || !newCheckOutDate || !booking) return;

    try {
      const token = (session as any)?.token;
      const updateData = {
        startDate: newCheckInDate.toDate(),
        endDate: newCheckOutDate.toDate(),
      };

      const resolveParams = await params;
      const bookinngId = resolveParams.bookingid;
      await updateBooking((await params).bookingid, updateData, token);

      // Update local state
      setBooking({
        ...booking,
        startDate: newCheckInDate.toDate(),
        endDate: newCheckOutDate.toDate(),
      });

      setIsEditing(false);
      toast.success('Booking dates updated successfully!');
    } catch (err: any) {
      console.error('Error updating booking:', err);
      toast.error('Failed to update booking dates');
    }
  };

  const handleCancelBooking = async () => {
    try {
      const token = (session as any)?.token;
      const resolveParams = await params;
      const bookinngId = resolveParams.bookingid;
      await deleteBooking((await params).bookingid, token);

      toast.success('Booking cancelled successfully');

      // Redirect to bookings page
      router.push('/bookings');
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const isCheckInDateDisabled = (date: dayjs.Dayjs) => {
    const today = dayjs();

    // Can't select dates in the past
    if (date.isBefore(today, 'day')) {
      return true;
    }

    // Can't edit check-in date for active or past bookings
    const status = getBookingStatus();
    if (status === 'Active' || status === 'Completed') {
      return true;
    }

    return false;
  };

  const isCheckOutDateDisabled = (date: dayjs.Dayjs) => {
    // Date must be after check-in
    if (newCheckInDate && date.isBefore(newCheckInDate, 'day')) {
      return true;
    }

    // Max stay is 3 days
    if (newCheckInDate && date.diff(newCheckInDate, 'day') > 3) {
      return true;
    }

    // Can't edit check-out date for past bookings
    const status = getBookingStatus();
    if (status === 'Completed') {
      return true;
    }

    return false;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  if (isLoading || status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-6 text-white'>
        <div className='text-center py-10'>
          <h2 className='text-2xl font-semibold mb-4'>Error Loading Booking</h2>
          <p className='text-gray-400 mb-6'>{error}</p>
          <Button variant='bluely' onClick={() => router.push('/bookings')}>
            Return to Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className='container mx-auto px-4 py-6 text-white'>
        <div className='text-center py-10'>
          <h2 className='text-2xl font-semibold mb-4'>Booking Not Found</h2>
          <Button variant='bluely' onClick={() => router.push('/bookings')}>
            Return to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const bookingStatus = getBookingStatus();
  const isPastBooking = bookingStatus === 'Completed';

  return (
    <div className='text-white p-6 bg-base-gd min-h-screen font-detail'>
      <div className='container mx-auto max-w-5xl'>
        <div className='mb-8'>
          <Button
            variant='link'
            onClick={handleBack}
            className='text-gray-400 hover:text-white cursor-pointer'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Manage Bookings
          </Button>
        </div>

        <h1 className='text-4xl font-bold font-heading mb-6 font-heading'>
          Booking Details
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Left column - Hotel info */}
          <div className='md:col-span-2'>
            <div className='bg-bg-box border border-bg-border rounded-md p-6 mb-6'>
              <h2 className='text-2xl font-bold font-heading mb-4'>
                Hotel Information
              </h2>

              {hotel && (
                <div>
                  <h3 className='text-xl font-medium mb-2'>{hotel.name}</h3>

                  <div className='flex items-center mb-2'>
                    <MapPin className='h-4 w-4 mr-2' />
                    <span className='text-gray-300'>
                      {hotel.buildingNumber} {hotel.street}, {hotel.district},{' '}
                      {hotel.province} {hotel.postalCode}
                    </span>
                  </div>

                  <div className='flex items-center mb-2'>
                    <Phone className='h-4 w-4 mr-2' />
                    <span className='text-gray-300'>{hotel.tel}</span>
                  </div>

                  <div className='flex items-center'>
                    <Star className='h-4 w-4 fill-amber-300 text-amber-300 mr-1' />
                    <span className='font-medium'>
                      {hotel.ratingCount > 0
                        ? (hotel.ratingSum / hotel.ratingCount).toFixed(1)
                        : 'No ratings'}
                    </span>
                    <span className='text-gray-400 ml-2'>
                      ({hotel.ratingCount} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className='bg-bg-box border border-bg-border rounded-md p-6 mb-6'>
              <h2 className='text-2xl font-bold font-heading mb-4 font-heading'>
                Stay Details
              </h2>

              <div className='flex justify-between items-start mb-4'>
                <div className='space-y-4'>
                  <div>
                    <span className='text-gray-400 block'>Check-in</span>
                    <span className='text-lg font-medium'>
                      {formatDate(new Date(booking.startDate))}
                    </span>
                  </div>

                  <div>
                    <span className='text-gray-400 block'>Check-out</span>
                    <span className='text-lg font-medium'>
                      {formatDate(new Date(booking.endDate))}
                    </span>
                  </div>

                  <div>
                    <span className='text-gray-400 block'>Duration</span>
                    <span className='text-lg font-medium'>
                      {dayjs(booking.endDate).diff(
                        dayjs(booking.startDate),
                        'day',
                      )}{' '}
                      nights
                    </span>
                  </div>
                </div>

                <div className='text-right'>
                  <span className='text-gray-400 block'>Status</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
                      bookingStatus === 'Active'
                        ? 'bg-green-900/50 text-green-400'
                        : bookingStatus === 'Upcoming'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-purple-900/50 text-purple-400'
                    }`}
                  >
                    {bookingStatus}
                  </span>
                </div>
              </div>

              <Separator className='my-4 bg-white/20' />

              <div>
                <h3 className='text-xl font-medium mb-3'>Rooms Booked</h3>
                <div className='space-y-3'>
                  {booking.rooms &&
                    booking.rooms.map((room: any, index: number) => (
                      <div
                        key={index}
                        className='p-3 bg-gray-800/50 border border-bg-border rounded-md'
                      >
                        <div className='flex justify-between'>
                          <span>{room.type}</span>
                          <span>x{room.count}</span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className='flex justify-between mt-4 pt-3 border-t border-gray-700'>
                  <span className='font-bold'>Total Price</span>
                  <span className='font-bold text-amber-300'>
                    ${booking.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-bg-box border border-bg-border rounded-md p-6'>
              <h2 className='text-2xl font-bold font-heading mb-4 font-heading'>
                Guest Information
              </h2>

              {user && (
                <div className='space-y-3'>
                  <div>
                    <span className='text-gray-400 block'>Name</span>
                    <span className='text-lg font-medium'>{user.name}</span>
                  </div>

                  <div>
                    <span className='text-gray-400 block'>Email</span>
                    <span className='text-lg font-medium'>{user.email}</span>
                  </div>

                  <div>
                    <span className='text-gray-400 block'>Phone</span>
                    <span className='text-lg font-medium'>{user.tel}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Actions */}
          <div className='md:col-span-1'>
            <div className='bg-bg-box border border-bg-border rounded-md p-6 sticky top-6'>
              <h2 className='text-xl font-bold font-heading mb-4'>
                Booking Actions
              </h2>

              {isEditing ? (
                <div className='mb-6'>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>
                      Check-in
                    </label>
                    <DateBookFill
                      selectedDate={newCheckInDate}
                      onDateChange={setNewCheckInDate}
                      shouldDisableDate={isCheckInDateDisabled}
                    />
                  </div>

                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>
                      Check-out
                    </label>
                    <DateBookFill
                      selectedDate={newCheckOutDate}
                      onDateChange={setNewCheckOutDate}
                      shouldDisableDate={isCheckOutDateDisabled}
                      disableBeforeDate={newCheckInDate}
                      disabled={!newCheckInDate}
                    />
                  </div>

                  <div className='flex gap-3 mt-4'>
                    <Button
                      variant='golden'
                      onClick={handleSaveChanges}
                      disabled={!newCheckInDate || !newCheckOutDate}
                    >
                      Save Changes
                    </Button>

                    <Button
                      variant='outline'
                      onClick={() => {
                        setNewCheckInDate(dayjs(booking.startDate));
                        setNewCheckOutDate(dayjs(booking.endDate));
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  {!isPastBooking && (
                    <Button
                      variant='golden'
                      className='w-full'
                      onClick={handleEditToggle}
                    >
                      Edit Booking
                    </Button>
                  )}

                  <Button
                    variant='destructive'
                    className='w-full'
                    onClick={() => setIsDeleteConfirmOpen(true)}
                  >
                    Cancel Booking
                  </Button>

                  {isPastBooking && (
                    <Button variant='golden' className='w-full'>
                      Write Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertConfirmation
        onOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        type='delete'
        onConfirm={handleCancelBooking}
      />
    </div>
  );
}
