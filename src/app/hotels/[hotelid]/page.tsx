'use client';
import CouponDropDown from '@/components/CouponDropDown';
import DateBookFill from '@/components/DateBookFill';
import Review, { ReviewType } from '@/components/Review';
import RoomCard from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import dayjs, { Dayjs } from 'dayjs';
import { Check, Info, MapPin, Minus, Plus, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';

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

interface Room {
  roomType: string;
  picture?: string;
  capacity: number;
  maxCount: number;
  remainCount: number;
  price: number;
}

interface Hotel {
  _id: string;
  name: string;
  description?: string;
  picture?: string;
  buildingNumber: string;
  street: string;
  district: string;
  province: string;
  postalCode: string;
  tel: string;
  rooms: Room[];
  ratingSum: number;
  ratingCount: number;
}

interface SelectedRoomWithQuantity {
  room: Room;
  quantity: number;
}

export default function HotelDetail({
  params,
}: {
  params: Promise<{ hotelid: string }>;
}) {
  const session = 'null';
  const [selectedRooms, setSelectedRooms] = useState<
    SelectedRoomWithQuantity[]
  >([]);
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [nights, setNights] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAvailabilityChecking, setIsAvailabilityChecking] = useState(false);
  const [isAvailabilityConfirmed, setIsAvailabilityConfirmed] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = checkOutDate.diff(checkInDate, 'day');
      setNights(nights);
    } else {
      setNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Mock hotel data
  const hotel: Hotel = {
    _id: '123456789012',
    name: 'Hotel Sunshine Luxury Resort',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
    picture:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    buildingNumber: '123',
    street: 'Beachfront Boulevard',
    district: 'Coastal District',
    province: 'Paradise Province',
    postalCode: '10540',
    tel: '0123456789',
    rooms: [
      {
        roomType: 'Deluxe Ocean View',
        picture:
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
        capacity: 2,
        maxCount: 5,
        remainCount: 3,
        price: 2150,
      },
      {
        roomType: 'Premium Suite',
        picture:
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        capacity: 2,
        maxCount: 8,
        remainCount: 6,
        price: 3250,
      },
      {
        roomType: 'Executive Room',
        picture:
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
        capacity: 2,
        maxCount: 10,
        remainCount: 7,
        price: 1750,
      },
      {
        roomType: 'Family Suite',
        picture:
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
        capacity: 4,
        maxCount: 4,
        remainCount: 2,
        price: 3950,
      },
    ],
    ratingSum: 1260,
    ratingCount: 280,
  };

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
        hotelName: hotel.name,
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
        hotelName: hotel.name,
        avatarUrl: '/hotel-logo.png',
        date: '2023-02-16',
        comment:
          "We apologize for the inconvenience you experienced during your stay. We take your feedback seriously and are working to improve our check-in process and response times. We hope you'll give us another chance to provide you with a better experience.",
      },
    },
  ];

  const averageRating =
    hotel.ratingCount > 0
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

  const handleConfirmBooking = (e: any) => {
    e.preventDefault();
    setIsConfirmOpen(false);

    toast.success('Booking Confirmed!', {
      description: `Your stay at ${hotel.name} has been successfully booked.`,
      duration: 5000,
      className: 'bg-blue-500 text-white border border-yellow-500',
      icon: <Check className='h-5 w-5 text-luxe-gold' />,
      action: {
        label: 'View Booking',
        onClick: () => console.log('View booking clicked'),
      },
    });

    setTimeout(() => {
      setSelectedRooms([]);
      setCheckInDate(null);
      setCheckOutDate(null);
      setIsAvailabilityConfirmed(false);
    }, 1000);
  };

  const handleCheckAvailable = () => {
    if (!checkInDate || !checkOutDate) return;

    setIsAvailabilityChecking(true);

    setTimeout(() => {
      setIsAvailabilityChecking(false);
      setIsAvailabilityConfirmed(true);

      toast.info('Rooms Available!', {
        description: `We have rooms available for your selected dates.`,
        className: 'bg-blue-500 text-white border border-yellow-500',
        icon: <Info className='h-5 w-5 text-luxe-gold' />,
      });
    }, 1500);
  };

  const handleSelectRoom = (room: Room) => {
    const existingRoomIndex = selectedRooms.findIndex(
      (item) => item.room.roomType === room.roomType,
    );

    if (existingRoomIndex >= 0) {
      const updatedRooms = [...selectedRooms];
      if (updatedRooms[existingRoomIndex].quantity < room.remainCount) {
        updatedRooms[existingRoomIndex].quantity += 1;
        setSelectedRooms(updatedRooms);

        toast('Room Added', {
          description: `Added 1 ${room.roomType} to your selection.`,
          className: 'bg-blue-500 text-white border border-yellow-500',
        });
      } else {
        toast.error('Maximum Reached', {
          description: `You've selected all available ${room.roomType} rooms.`,
          className: 'bg-red-500 text-white border border-red-400',
        });
      }
    } else {
      setSelectedRooms([...selectedRooms, { room, quantity: 1 }]);

      toast('Room Added', {
        description: `Added 1 ${room.roomType} to your selection.`,
        className: 'bg-blue-500 text-white border border-yellow-500',
      });
    }
  };

  const decreaseRoomQuantity = (roomType: string) => {
    const updatedRooms = selectedRooms.map((item) => {
      if (item.room.roomType === roomType) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - 1),
        };
      }
      return item;
    });

    const filteredRooms = updatedRooms.filter((item) => item.quantity > 0);

    const originalRoom = selectedRooms.find(
      (item) => item.room.roomType === roomType,
    );
    const updatedRoom = filteredRooms.find(
      (item) => item.room.roomType === roomType,
    );

    if (!updatedRoom && originalRoom) {
      toast('Room Removed', {
        description: `Removed ${originalRoom.room.roomType} from your selection.`,
        className: 'bg-blue-500 text-white border border-yellow-500',
      });
    } else if (
      originalRoom &&
      updatedRoom &&
      originalRoom.quantity > updatedRoom.quantity
    ) {
      toast(`Updated ${roomType} quantity to ${updatedRoom.quantity}.`, {
        className: 'bg-blue-500 text-white border border-yellow-500',
      });
    }

    setSelectedRooms(filteredRooms);
  };

  const increaseRoomQuantity = (roomType: string) => {
    const roomToUpdate = selectedRooms.find(
      (item) => item.room.roomType === roomType,
    );

    if (
      roomToUpdate &&
      roomToUpdate.quantity >= roomToUpdate.room.remainCount
    ) {
      toast.error('Maximum Reached', {
        description: `You've selected all available ${roomType} rooms.`,
        className: 'bg-red-500 text-white border border-red-400',
      });
      return;
    }

    const updatedRooms = selectedRooms.map((item) => {
      if (
        item.room.roomType === roomType &&
        item.quantity < item.room.remainCount
      ) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    const updatedRoom = updatedRooms.find(
      (item) => item.room.roomType === roomType,
    );
    if (
      updatedRoom &&
      roomToUpdate &&
      updatedRoom.quantity > roomToUpdate.quantity
    ) {
      toast(`Updated ${roomType} quantity to ${updatedRoom.quantity}.`, {
        className: 'bg-blue-500 text-white border border-yellow-500',
      });
    }

    setSelectedRooms(updatedRooms);
  };

  const calculateTotalPrice = () => {
    return selectedRooms.reduce((total, item) => {
      return total + item.room.price * item.quantity * nights;
    }, 0);
  };

  const fullAddress = `${hotel.buildingNumber} ${hotel.street}, ${hotel.district}, ${hotel.province} ${hotel.postalCode}`;

  const formatPhone = (phoneNumber: string) => {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  };

  return (
    <main className='flex-grow bg-luxe-dark text-white'>
      {/* Banner */}
      <div className='relative h-80 md:h-96'>
        <div
          className='absolute inset-0 bg-gray-600 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${hotel.picture})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-luxe-dark via-transparent to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 luxe-container'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end'>
            <div>
              <h1 className='text-3xl md:text-4xl font-serif font-bold mb-2'>
                {hotel.name}
              </h1>
              <div className='flex items-center mb-2'>
                <MapPin className='h-4 w-4 text-luxe-gold mr-1' />
                <span className='text-gray-300'>{fullAddress}</span>
              </div>
              <div className='flex items-center'>
                <div className='flex items-center mr-4'>
                  <Star className='h-4 w-4 fill-luxe-gold text-luxe-gold mr-1' />
                  <span className='font-medium'>{averageRating}</span>
                  <span className='text-gray-400 ml-2'>
                    ({hotel.ratingCount} reviews)
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
          <p className='text-lg font-normal text-black mb-8'>
            {hotel.description}
          </p>

          <h2 className='text-2xl font-bold mb-6 font-serif'>Our Rooms</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {hotel.rooms.map((room, index) => (
              <RoomCard
                key={index}
                room={room}
                onSelectRoom={handleSelectRoom}
              />
            ))}
          </div>

          <section className='mt-10'>
            <h2 className='text-2xl font-bold mb-6 font-serif'>
              Guest Reviews
            </h2>
            <div className='space-y-6'>
              {reviews.map((review) => (
                <Review key={review.id} review={review} />
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
              />
            </div>

            <p className='text-xs text-gray-400 mb-4'>
              Note: You can book up to 6 nights.
            </p>

            <Button
              variant='default'
              className='w-full bg-amber-300 text-cardfont-cl font-medium mb-6'
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
              <h3 className='text-lg font-medium mb-2'>Selected Rooms</h3>
              {selectedRooms.length > 0 ? (
                <div className='space-y-3'>
                  {selectedRooms.map((item, index) => (
                    <div
                      key={index}
                      className='p-3 bg-gray-800/50 border border-luxe-gold/30 rounded-md'
                    >
                      <div className='flex justify-between mb-2'>
                        <div className='font-medium'>{item.room.roomType}</div>
                        <div className='text-luxe-gold font-semibold'>
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
                          <span>{item.quantity}</span>
                          <button
                            type='button'
                            className={`p-1 rounded-full ${
                              item.quantity >= item.room.remainCount
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                            onClick={() =>
                              increaseRoomQuantity(item.room.roomType)
                            }
                            disabled={item.quantity >= item.room.remainCount}
                          >
                            <Plus className='h-4 w-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 text-sm'>
                  Please Select At Least 1 Room
                </p>
              )}
            </div>

            <div>
              {selectedRooms.length > 0 && checkInDate && checkOutDate ? (
                <div>
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
                          {item.room.roomType} (x{item.quantity})
                        </span>
                        <span>
                          $
                          {(
                            item.room.price *
                            item.quantity *
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
                      className='w-full bg-luxe-gold hover:bg-amber-500 text-black mt-2'
                      onClick={handleBooking}
                      variant='default'
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
        <AlertDialogContent className='bg-[#1A1F2F] border-luxe-gold text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-luxe-gold font-serif text-2xl'>
              Confirm Your Booking
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-300'>
              <div className='space-y-4 py-2'>
                <div className='p-4 bg-[#2A2F3F] rounded-md'>
                  <h3 className='font-medium text-luxe-gold mb-2'>
                    {hotel.name}
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
                        {item.room.roomType} (x{item.quantity})
                      </span>
                      <span className='font-medium'>
                        $
                        {(
                          item.room.price *
                          item.quantity *
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
            <AlertDialogCancel className='border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-luxe-gold hover:bg-amber-500 text-black'
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
