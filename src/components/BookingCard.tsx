import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface BookingCardProps {
  id: string;
  hotelName: string;
  checkInDate: Date;
  checkOutDate: Date;
  location: string;
  type: 'active' | 'upcoming' | 'past';
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

export const BookingCard = ({
  id,
  hotelName,
  checkInDate,
  checkOutDate,
  location,
  type,
}: BookingCardProps) => {
  // Format the dates for display in the format "Apr 9, 2025"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days until check-in for upcoming bookings
  const getDaysUntil = () => {
    if (type !== 'upcoming') return null;

    const today = getTodayDate();
    const checkIn = createDateForComparison(checkInDate);

    const timeDiff = checkIn.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return `In ${dayDiff} Days`;
  };

  const daysUntil = getDaysUntil();

  return (
    <div className='w-full bg-bg-box border border-bg-border bg-opacity-30 p-4 rounded-lg font-detail'>
      <div className='flex justify-between items-start'>
        <div>
          <h3 className='text-xl font-semibold font-heading text-white'>
            {hotelName}
          </h3>

          <div className='mt-3 text-gray-300 space-y-2'>
            <div className='flex items-center'>
              <Calendar className='h-4 w-4 mr-2' />
              <span>check-in: {formatDate(checkInDate)}</span>
            </div>

            <div className='flex items-center'>
              <Calendar className='h-4 w-4 mr-2' />
              <span>check-out: {formatDate(checkOutDate)}</span>
            </div>

            <div className='flex items-center'>
              <MapPin className='h-4 w-4 mr-2' />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {type === 'upcoming' && (
          <div className='text-white font-medium text-sm'>{daysUntil}</div>
        )}
      </div>

      <div className='mt-4'>
        <Link href={`/bookings/${id}`} passHref>
          <Button variant='bluely' className='px-6'>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};
