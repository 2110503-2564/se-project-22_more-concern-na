'use client';
import CouponDropDown from '@/components/CouponDropDown';
import DateBookFill from '@/components/DateBookFill';
import RoomCard from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import dayjs, { Dayjs } from 'dayjs';
import { Check, Info, MapPin, Minus, Phone, Plus, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import Loader from '@/components/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { IHotel, Rooms } from '../../../../interface';

import ReviewList from '@/components/ReviewList';
import { createHotelBooking } from '@/lib/bookingService';
import { checkAvailability, getHotel } from '@/lib/hotelService';
import { getPriceToPoint } from '@/lib/redeemableService';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  BookingsRequest,
  HotelAvailabilityResponse,
  InventoryCouponsData
} from '../../../../interface';

export default function HotelDetail({
  params,
}: {
  params: Promise<{ hotelid: string }>;
}) {
  const [selectedRooms, setSelectedRooms] = useState<
    { type: string; count: number; room: Rooms }[]
  >([]);
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [nights, setNights] = useState(0);
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] =
    useState<HotelAvailabilityResponse | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAvailabilityChecking, setIsAvailabilityChecking] = useState(false);
  const [isAvailabilityConfirmed, setIsAvailabilityConfirmed] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [priceToPoint, setPriceToPoint] = useState<number | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<InventoryCouponsData | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.user?.token;
  const router = useRouter();

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = checkOutDate.diff(checkInDate, 'day');
      setNights(nights);
    } else {
      setNights(0);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const fetchHotel = async () => {
      const resolveParams = await params;
      const hotelId = resolveParams.hotelid;
      const response = await getHotel(hotelId);
      setHotel(response);
      setLoading(false);
    };
    fetchHotel();
  }, [params]);

  useEffect(() => {
    const fetchPriceToPoint = async () => {
      if (!token) {
        signIn();
        return;
      }
      try {
        const price = await getPriceToPoint(token);
        console.log('Price to Point:', price);
        setPriceToPoint(price);
      } catch (error) {
        console.error('Failed to fetch priceToPoint:', error);
      }
    };

    fetchPriceToPoint();
  }, [token]);

  const averageRating =
    hotel?.ratingCount && hotel.ratingCount > 0
      ? (hotel.ratingSum / hotel.ratingCount).toFixed(1)
      : '0.0';

  const isCheckInDateDisabled = (date: Dayjs) => {
    return date.isBefore(dayjs(), 'day');
  };

  const isCheckOutDateDisabled = (date: Dayjs) => {
    if (date.isBefore(dayjs(), 'day') || date.isBefore(checkInDate, 'day')) {
      return true;
    }
    if (checkInDate && date.diff(checkInDate, 'day') > 3) {
      return true;
    }

    return false;
  };

  const handleCheckInChange = (date: Dayjs) => {
    setCheckInDate(date);
    if (checkOutDate) {
      if (checkOutDate.isBefore(date) || checkOutDate.diff(date, 'day') > 3) {
        setCheckOutDate(null);
      }
    }
    setIsAvailabilityConfirmed(false);
  };

  const handleCheckOutChange = (date: Dayjs) => {
    if (checkInDate && date.diff(checkInDate, 'day') <= 3) {
      setCheckOutDate(date);
      setIsAvailabilityConfirmed(false);
    }
  };

  const handleBooking = (e: any) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleNoSessionBook = (e: any) => {
    e.preventDefault();
    toast.error('Please login to book', {
      description: 'You need to be logged in to book a hotel',
      style: {
        backgroundColor: '#a52a2a',
        color: 'white',
        border: '1px solid var(--color-bg-border)',
      },
    });
    router.push('/api/auth/login');
  };

  const handleConfirmBooking = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    setIsBookingInProgress(true);
    setIsConfirmOpen(false);
  
    if (!hotel?._id || !checkInDate || !checkOutDate || !token) {
      toast.error('Booking Failed', {
        description: 'Missing required booking information or not logged in',
        style: {
          backgroundColor: '#a52a2a',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
      setIsBookingInProgress(false);
      return;
    }
  
    try {
      const rooms = selectedRooms.map((item) => ({
        roomType: item.type,
        count: item.count,
      }));
  
      const bookingData: Omit<BookingsRequest, 'hotel'> = {
        price: calculateTotalPrice(),
        startDate: checkInDate.format('YYYY-MM-DD'),
        endDate: checkOutDate.format('YYYY-MM-DD'),
        rooms: rooms,
        ...(selectedCoupon ? { couponId: selectedCoupon.id } : {}),
      };
  
      const response = await createHotelBooking(hotel._id, bookingData, token);
  
      if (response.success) {
        toast.success('Booking Confirmed!', {
          description: `Your stay at ${hotel.name} has been successfully booked.`,
          duration: 5000,
          icon: <Check className="h-5 w-5" />,
          action: {
            label: 'View Booking',
            onClick: () => router.push(`/bookings`),
          },
          style: {
            backgroundColor: '#06402b',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });

        setTimeout(() => {
          setSelectedRooms([]);
          setCheckInDate(null);
          setCheckOutDate(null);
          setIsAvailabilityConfirmed(false);
          setSelectedCoupon(null);
          setIsBookingInProgress(false);
        }, 1000);
      } else {
        toast.error('Booking Failed', {
          description: response.msg || 'Something went wrong',
          style: {
            backgroundColor: '#a52a2a',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });
        setIsBookingInProgress(false);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error('Booking Failed', {
        description: error.message || 'Something went wrong',
        style: {
          backgroundColor: '#a52a2a',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
      setIsBookingInProgress(false);
    }
  };  

  const handleCheckAvailable = async () => {
    if (!checkInDate || !checkOutDate || !hotel?._id) return;

    setIsAvailabilityChecking(true);

    try {
      const resolveParams = await params;
      const hotelId = resolveParams.hotelid;
      const response = await checkAvailability(
        hotelId,
        checkInDate.format('YYYY-MM-DD'),
        checkOutDate.format('YYYY-MM-DD'),
        token,
      );

      setAvailabilityData(response);
      setIsAvailabilityChecking(false);

      if (response.success) {
        setIsAvailabilityConfirmed(true);
        toast.info('Rooms Available!', {
          description: `We have rooms available for your selected dates.`,
          icon: <Info className='h-5 w-5' />,
          style: {
            backgroundColor: '#2A2F3F',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });

        setSelectedRooms([]);
      } else {
        toast.error('No Availability', {
          description: response.msg || 'No rooms available for selected dates',
          style: {
            backgroundColor: '#a52a2a',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setIsAvailabilityChecking(false);
      toast.error('Error', {
        description: 'Failed to check room availability',
        style: {
          backgroundColor: '#a52a2a',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
    }
  };

  const handleSelectRoom = (room: Rooms) => {
    const existingRoomIndex = selectedRooms.findIndex(
      (item) => item.type === room.roomType,
    );

    if (existingRoomIndex >= 0) {
      const updatedRooms = [...selectedRooms];
      if (updatedRooms[existingRoomIndex].count < room.maxCount) {
        updatedRooms[existingRoomIndex].count += 1;
        setSelectedRooms(updatedRooms);

        toast('Room Added', {
          description: `Added 1 ${room.roomType} to your selection.`,
          style: {
            backgroundColor: '#2A2F3F',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });
      } else {
        toast.error('Maximum Reached', {
          description: `You've selected all available ${room.roomType} rooms.`,
          style: {
            backgroundColor: '#a52a2a',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });
      }
    } else {
      setSelectedRooms([
        ...selectedRooms,
        { type: room.roomType, count: 1, room },
      ]);

      toast('Room Added', {
        description: `Added 1 ${room.roomType} to your selection.`,
        style: {
          backgroundColor: '#2A2F3F',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
    }
  };

  const decreaseRoomQuantity = (roomType: string) => {
    const updatedRooms = selectedRooms.map((item) => {
      if (item.type === roomType) {
        return {
          ...item,
          count: Math.max(0, item.count - 1),
        };
      }
      return item;
    });

    const filteredRooms = updatedRooms.filter((item) => item.count > 0);

    const originalRoom = selectedRooms.find((item) => item.type === roomType);
    const updatedRoom = filteredRooms.find((item) => item.type === roomType);

    if (!updatedRoom && originalRoom) {
      toast('Room Removed', {
        description: `Removed ${originalRoom.type} from your selection.`,
        style: {
          backgroundColor: '#2A2F3F',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
    } else if (
      originalRoom &&
      updatedRoom &&
      originalRoom.count > updatedRoom.count
    ) {
      toast(`Updated ${roomType} quantity to ${updatedRoom.count}.`, {
        style: {
          backgroundColor: '#2A2F3F',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
    }

    setSelectedRooms(filteredRooms);
  };

  const increaseRoomQuantity = (roomType: string) => {
    const roomToUpdate = selectedRooms.find((item) => item.type === roomType);

    if (roomToUpdate && roomToUpdate.count >= roomToUpdate.room.maxCount) {
      toast.error('Maximum Reached', {
        description: `You've selected all available ${roomType} rooms.`,
        style: {
          backgroundColor: '#a52a2a',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
      return;
    }

    const updatedRooms = selectedRooms.map((item) => {
      if (item.type === roomType && item.count < item.room.maxCount) {
        return {
          ...item,
          count: item.count + 1,
        };
      }
      return item;
    });

    const updatedRoom = updatedRooms.find((item) => item.type === roomType);
    if (updatedRoom && roomToUpdate && updatedRoom.count > roomToUpdate.count) {
      toast(`Updated ${roomType} quantity to ${updatedRoom.count}.`, {
        style: {
          backgroundColor: '#2A2F3F',
          color: 'white',
          border: '1px solid var(--color-bg-border)',
        },
      });
    }

    setSelectedRooms(updatedRooms);
  };

  const calculateTotalPrice = () => {
    const base = selectedRooms.reduce((total, item) => {
      return total + item.room.price * item.count * nights;
    }, 0);
    const discount = selectedCoupon?.discount ?? 0;
    return Math.max(base - discount, 0);
  };

  const fullAddress = `${hotel?.buildingNumber} ${hotel?.street}, ${hotel?.district}, ${hotel?.province} ${hotel?.postalCode}`;

  const formatPhone = (phoneNumber: string) => {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <main className='flex-grow bg-luxe-dark text-white'>
      {/* Banner */}
      <div className='relative h-80 md:h-96'>
        <div
          className='absolute inset-0 bg-gray-600 bg-cover bg-center bg-no-repeat'
          // style={{ backgroundImage: `url(${hotel?.picture})` || `url(/defaultHotel.png)` }}
          style={{ backgroundImage: `url(/defaultHotel.png)` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-base-gd via-transparent to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end'>
            <div>
              <h1 className='text-3xl md:text-4xl font-heading font-bold mb-2'>
                {hotel?.name}
              </h1>
              <div className='flex items-center mb-2'>
                <MapPin className='h-4 w-4 mr-1' />
                <span className='text-gray-300 font-detail'>{fullAddress}</span>
              </div>
              <div className='flex items-center'>
                <div className='flex items-center mr-4'>
                  <Star className='h-4 w-4 fill-amber-300 text-amber-300 mr-1' />
                  <span className='font-medium font-detail'>
                    {averageRating}
                  </span>
                  <span className='text-gray-400 font-detail ml-2'>
                    ({hotel?.ratingCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='container mx-auto px-4 py-8 flex flex-col md:flex-row'>
        <div className='flex-1 md:mr-8'>
          <div className='text-lg font-normal font-detail text-white mb-8'>
            {hotel?.description}
            <div className='flex mt-3 items-center'>
              <Phone className='h-4 w-4 mr-2' />{' '}
              <span>{formatPhone(hotel?.tel ?? '')}</span>
            </div>
          </div>

          <h2 className='text-2xl font-bold mb-6 font-detail'>Our Rooms</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {hotel?.rooms?.map((room, index) => {
              // Find availability information for this room type
              const availabilityInfo =
                isAvailabilityConfirmed && availabilityData?.rooms
                  ? availabilityData.rooms.find(
                      (avail) => avail.roomType === room.roomType,
                    )
                  : null;

              // Determine how many rooms are available
              const availableCount = availabilityInfo
                ? availabilityInfo.remainCount
                : null;

              return (
                <RoomCard
                  key={index}
                  room={{
                    ...room,
                    // Override maxCount with available count when available
                    maxCount:
                      availableCount !== null ? availableCount : room.maxCount,
                  }}
                  onSelectRoom={handleSelectRoom}
                  availability={
                    isAvailabilityConfirmed
                      ? {
                          checkedDates: true,
                          availableCount: availableCount,
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>

          <section className='mt-10'>
            <ReviewList title='Your Reviews' isSelf hotelId={hotel?._id} />
            <ReviewList title='Other Reviews' hotelId={hotel?._id} />
          </section>
        </div>

        {/* Booking form */}
        <form className='md:w-96 mt-8 md:mt-0'>
          <div className='bg-bg-box border-bg-border rounded-md p-6 sticky top-6'>
            <h2 className='text-2xl font-bold mb-4 font-heading'>
              Book your stay
            </h2>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Check-in</label>
              <DateBookFill
                selectedDate={checkInDate}
                onDateChange={handleCheckInChange}
                shouldDisableDate={isCheckInDateDisabled}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Check-out
              </label>
              <DateBookFill
                selectedDate={checkOutDate}
                onDateChange={handleCheckOutChange}
                shouldDisableDate={isCheckOutDateDisabled}
                disableBeforeDate={checkInDate}
                disabled={!checkInDate}
              />
            </div>

            <p className='text-xs text-gray-400 mb-4'>
              Note: You can book up to 3 nights.
            </p>

            <Button
              variant='golden'
              className='w-full text-base mb-6'
              disabled={!checkInDate || !checkOutDate || isAvailabilityChecking}
              onClick={handleCheckAvailable}
            >
              {isAvailabilityChecking
                ? 'Checking...'
                : isAvailabilityConfirmed
                  ? 'Available ✓'
                  : 'Check Available'}
            </Button>

            <Separator className='my-4 bg-white/20' />

            <div className='mb-6'>
              <h3 className='text-lg font-detail font-medium mb-2'>
                Selected Rooms
              </h3>
              {selectedRooms.length > 0 ? (
                <div className='space-y-3 font-detail'>
                  {selectedRooms.map((item, index) => (
                    <div
                      key={index}
                      className='p-3 bg-gray-800/50 border border-bg-border rounded-md'
                    >
                      <div className='flex justify-between mb-2'>
                        <div className='font-medium'>{item.room.roomType}</div>
                        <div className='text-amber-300 font-semibold'>
                          ${item.room.price} per night
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span>Quantity:</span>
                        <div className='flex items-center space-x-3'>
                          <button
                            type='button'
                            className='p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white'
                            onClick={() =>
                              decreaseRoomQuantity(item.room.roomType)
                            }
                          >
                            <Minus className='h-4 w-4' />
                          </button>
                          <span>{item.count}</span>
                          <button
                            type='button'
                            className={`p-1 rounded-full ${
                              item.count >= item.room.maxCount
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                            onClick={() =>
                              increaseRoomQuantity(item.room.roomType)
                            }
                            disabled={item.count >= item.room.maxCount}
                          >
                            <Plus className='h-4 w-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 font-number text-sm'>
                  Please Select At Least 1 Room
                </p>
              )}
            </div>

            <div>
              {selectedRooms.length > 0 && checkInDate && checkOutDate ? (
                <div className='font-detail'>
                  <h3 className='text-lg font-medium mb-2'>Booking Summary</h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span>Check-in Date</span>
                      <span>
                        {checkInDate
                          ? checkInDate.format('MM/DD/YYYY')
                          : 'MM/DD/YYYY'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Check-out Date</span>
                      <span>
                        {checkOutDate
                          ? checkOutDate.format('MM/DD/YYYY')
                          : 'MM/DD/YYYY'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Number of Nights</span>
                      <span>{nights}</span>
                    </div>

                    {selectedRooms.map((item, index) => (
                      <div key={index} className='flex justify-between text-xs'>
                        <span>
                          {item.room.roomType} (x{item.count})
                        </span>
                        <span>
                          $
                          {(
                            item.room.price *
                            item.count *
                            nights
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <span>Coupon</span>
                        <CouponDropDown onSelect={setSelectedCoupon} />
                      </div>
                      {selectedCoupon ? (
                        <div className="text-xs text-gold-gd2 mt-1">
                          Selected Coupon: {selectedCoupon.name} (-{selectedCoupon.discount}฿)
                        </div>
                      ) : (
                        <div className="text-xs text-bg-placeholder mt-1">
                          No coupon selected
                        </div>
                      )}
                    </div>
                    <div className='flex justify-between pt-2 border-t border-gray-600'>
                      <span className='font-bold'>Total</span>
                      <span className='font-bold'>
                        ${calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    {session ? (
                      <Button
                        className='w-full text-base mt-2'
                        onClick={handleBooking}
                        variant='golden'
                        disabled={
                          !isAvailabilityConfirmed || isBookingInProgress
                        }
                      >
                        {isBookingInProgress ? 'Processing...' : 'Book Now'}
                      </Button>
                    ) : (
                      <Button
                        className='w-full text-base mt-2'
                        onClick={handleNoSessionBook}
                        variant='golden'
                        disabled={
                          !isAvailabilityConfirmed || isBookingInProgress
                        }
                      >
                        Login to Book
                      </Button>
                    )}
                    {!isAvailabilityConfirmed &&
                      checkInDate &&
                      checkOutDate && (
                        <p className='text-xs text-amber-300 text-center mt-2'>
                          Please check availability before booking
                        </p>
                      )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className='bg-bg-box border-bg-border text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white font-heading text-2xl'>
              Confirm Your Booking
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-300 font-detail'>
              <div className='space-y-4 py-2'>
                <div className='p-4 bg-[#2A2F3F] rounded-md'>
                  <h3 className='font-medium text-luxe-gold mb-2'>
                    {hotel?.name}
                  </h3>
                  <div className='text-sm space-y-2'>
                    <div className='flex justify-between'>
                      <span>Check-in:</span>
                      <span className='font-medium'>
                        {checkInDate?.format('MM/DD/YYYY')}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Check-out:</span>
                      <span className='font-medium'>
                        {checkOutDate?.format('MM/DD/YYYY')}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Duration:</span>
                      <span className='font-medium'>{nights} nights</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Coupon Discount</span>
                      <span className="font-medium text-red-400">
                        {selectedCoupon ? `- ${selectedCoupon.discount.toLocaleString()}฿` : '0฿'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='font-medium text-luxe-gold mb-2'>
                    Selected Rooms
                  </h3>
                  {selectedRooms.map((item, index) => (
                    <div
                      key={index}
                      className='flex justify-between mb-1 text-sm'
                    >
                      <span>
                        {item.room.roomType} (x{item.count})
                      </span>
                      <span className='font-medium'>
                        $
                        {(
                          item.room.price *
                          item.count *
                          nights
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between pt-3 border-t border-gray-700'>
                  <span className='font-bold'>Total Amount</span>
                  <span className='font-bold text-luxe-gold'>
                    ${calculateTotalPrice().toLocaleString()}
                  </span>
                </div>

                {/* New row to show points earned */}
                <div className='flex justify-between text-sm'>
                  <span className='text-gold-gd1 font-semibold'>
                    Points to Earn:
                  </span>{' '}
                  {/* << change text to match test */}
                  <span className='font-medium text-gold-gd1'>
                    {priceToPoint
                      ? Math.floor(calculateTotalPrice() / priceToPoint)
                      : 0}{' '}
                    points
                  </span>
                </div>

                {/* ADD this new paragraph as per test requirement */}
                <p className='text-xs text-gray-400 mt-1'>
                  The points will be added after check-in
                </p>

                <p className='text-xs text-gray-400 mt-4'>
                  By confirming this booking, you agree to our terms and
                  conditions. A confirmation email will be sent to your
                  registered email address.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel className='border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
              onClick={handleConfirmBooking}
              disabled={isBookingInProgress}
            >
              {isBookingInProgress ? 'Processing...' : 'Confirm Booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}