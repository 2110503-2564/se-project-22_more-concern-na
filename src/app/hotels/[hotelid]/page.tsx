'use client';
import CouponDropDown from '@/components/CouponDropDown';
import DateBookFill from '@/components/DateBookFill';
import Review, { ReviewType } from '@/components/Review';
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

import { Rooms, IHotel } from '../../../../interface';

import { createHotelBooking } from '@/lib/bookingService';
import {
  checkAvailability,
  getHotel,
  getHotelReviews,
} from '@/lib/hotelService';
import { useSession } from 'next-auth/react';
import {
  BookingsRequest,
  HotelAvailabilityResponse,
  HotelReviewsResponse,
} from '../../../../interface';
import { useRouter } from 'next/navigation';

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
  const [reviewsData, setReviewsData] = useState<HotelReviewsResponse | null>(
    null,
  );
  const [filteredreview, setfilteredReview] = useState<ReviewType[]>([
    {
      id: 1,
      username: 'John Doe',
      avatarUrl: '/john-avatar.png',
      date: '2023-04-10',
      rating: 4,
      title: 'Great stay!',
      comment:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
      reply: {
        id: 101,
        hotelName: 'hotel.name',
        avatarUrl: '/hotel-logo.png',
        date: '2023-04-11',
        comment:
          "Thank you for your kind review! We're delighted that you enjoyed your stay with us and appreciate your feedback. We hope to welcome you back soon for another wonderful experience.",
      },
    },
    {
      id: 2,
      username: 'Jane Smith',
      avatarUrl: '/jane-avatar.png',
      date: '2023-03-22',
      rating: 5,
      title: 'Excellent!',
      comment:
        'Beautiful hotel with stunning views. The staff was incredibly attentive and the amenities were top-notch. Will definitely be coming back soon!',
    },
    {
      id: 3,
      username: 'Michael Johnson',
      avatarUrl: '/michael-avatar.png',
      date: '2023-02-15',
      rating: 3,
      title: 'Decent stay but room for improvement',
      comment:
        "The location was great and the room was clean, but the service could be better. We had to wait a long time for check-in and there were some issues with our room that weren't resolved promptly.",
      reply: {
        id: 102,
        hotelName: 'hotel.name',
        avatarUrl: '/hotel-logo.png',
        date: '2023-02-16',
        comment:
          "We apologize for the inconvenience you experienced during your stay. We take your feedback seriously and are working to improve our check-in process and response times. We hope you'll give us another chance to provide you with a better experience.",
      },
    },
  ]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAvailabilityChecking, setIsAvailabilityChecking] = useState(false);
  const [isAvailabilityConfirmed, setIsAvailabilityConfirmed] = useState(false);

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
    const fetchReviews = async () => {
      try {
        const resolveParams = await params;
        const hotelId = resolveParams.hotelid;
        const response = await getHotelReviews(hotelId, {
          selfPage: 1,
          selfPageSize: 5,
          otherPage: 1,
          otherPageSize: 5,
        });
        setReviewsData(response);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (hotel?._id) {
      fetchReviews();
    }
  }, [hotel?._id, params]);

  // MOCK REVIEW DATA
  const reviews: ReviewType[] = [
    {
      id: 1,
      username: 'John Doe',
      avatarUrl: '/john-avatar.png',
      date: '2023-04-10',
      rating: 4,
      title: 'Great stay!',
      comment:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
      reply: {
        id: 101,
        hotelName: hotel?.name || '',
        avatarUrl: '/hotel-logo.png',
        date: '2023-04-11',
        comment:
          "Thank you for your kind review! We're delighted that you enjoyed your stay with us and appreciate your feedback. We hope to welcome you back soon for another wonderful experience.",
      },
    },
    {
      id: 2,
      username: 'Jane Smith',
      avatarUrl: '/jane-avatar.png',
      date: '2023-03-22',
      rating: 5,
      title: 'Excellent!',
      comment:
        'Beautiful hotel with stunning views. The staff was incredibly attentive and the amenities were top-notch. Will definitely be coming back soon!',
    },
    {
      id: 3,
      username: 'Michael Johnson',
      avatarUrl: '/michael-avatar.png',
      date: '2023-02-15',
      rating: 3,
      title: 'Decent stay but room for improvement',
      comment:
        "The location was great and the room was clean, but the service could be better. We had to wait a long time for check-in and there were some issues with our room that weren't resolved promptly.",
      reply: {
        id: 102,
        hotelName: hotel?.name || '',
        avatarUrl: '/hotel-logo.png',
        date: '2023-02-16',
        comment:
          "We apologize for the inconvenience you experienced during your stay. We take your feedback seriously and are working to improve our check-in process and response times. We hope you'll give us another chance to provide you with a better experience.",
      },
    },
  ];

  const averageRating =
    hotel?.ratingCount && hotel.ratingCount > 0
      ? (hotel.ratingSum / hotel.ratingCount).toFixed(1)
      : '0.0';

  const handleDeleteReview = (reviewId: number) => {
    setfilteredReview((prevReviews) =>
      prevReviews.filter((r) => r.id !== reviewId),
    );
  };

  const handleDeleteReply = async (reviewId: number, replyId: number) => {
    setfilteredReview((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id === reviewId && review.reply?.id === replyId) {
          return { ...review, reply: undefined };
        } else {
          return review;
        }
      }),
    );
  };

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

  const handleConfirmBooking = async (e: React.MouseEvent) => {
    e.preventDefault();
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
      };

      const response = await createHotelBooking(
        hotel._id,
        bookingData,
        token,
      );

      if (response.success) {
        toast.success('Booking Confirmed!', {
          description: `Your stay at ${hotel.name} has been successfully booked.`,
          duration: 5000,
          icon: <Check className='h-5 w-5' />,
          action: {
            label: 'View Booking',
            onClick: () => (router.push(`/bookings`)),
          },
          style: {
            backgroundColor: '#06402b',
            color: 'white',
            border: '1px solid var(--color-bg-border)',
          },
        });

        // Reset form data after successful booking
        setTimeout(() => {
          setSelectedRooms([]);
          setCheckInDate(null);
          setCheckOutDate(null);
          setIsAvailabilityConfirmed(false);
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
    return selectedRooms.reduce((total, item) => {
      return total + item.room.price * item.count * nights;
    }, 0);
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
          style={{ backgroundImage: `url(${hotel?.picture})` }}
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
            <h2 className='text-2xl font-bold mb-6 font-detail'>
              Guest Reviews
            </h2>
            <div className='space-y-6'>
              {filteredreview.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  onDeleteReview={handleDeleteReview}
                  onDeleteReply={handleDeleteReply}
                />
              ))}
            </div>
            <div className='flex justify-center mt-6'>
              <div className='flex items-center space-x-2'>
                <button className='text-luxe-gold hover:text-amber-400'>
                  <div className='w-6 h-6 flex items-center justify-center border border-luxe-gold rounded-full transform rotate-180'>
                    ›
                  </div>
                </button>
                <span className='text-black text-sm'>1/4</span>
                <button className='text-luxe-gold hover:text-amber-400'>
                  <div className='w-6 h-6 flex items-center justify-center border border-luxe-gold rounded-full'>
                    ›
                  </div>
                </button>
              </div>
            </div>
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

                    <div className='flex justify-between'>
                      <span>Coupon</span>
                      <CouponDropDown />
                    </div>
                    <div className='flex justify-between pt-2 border-t border-gray-600'>
                      <span className='font-bold'>Total</span>
                      <span className='font-bold'>
                        ${calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className='w-full text-base mt-2'
                      onClick={handleBooking}
                      variant='golden'
                      disabled={!isAvailabilityConfirmed}
                    >
                      {session ? 'Book Now' : 'Login to Book'}
                    </Button>
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
            >
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
