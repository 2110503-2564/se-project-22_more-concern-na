import { Calendar, Check, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface BookingCardProps {
  id: string;
  hotelName: string;
  checkInDate: Date;
  checkOutDate: Date;
  location: string;
  type: 'active' | 'upcoming' | 'past';
  daysUntil?: number;
  checkedIn?: boolean;
  showCheckInOption?: boolean;
  onCheckIn?: (id: string) => void;
}

export const BookingCard = ({
  id,
  hotelName,
  checkInDate,
  checkOutDate,
  location,
  type,
  daysUntil,
  checkedIn = false,
  showCheckInOption = false,
  onCheckIn,
}: BookingCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

        {type === 'upcoming' && daysUntil !== undefined && (
          <div className='text-white font-medium text-sm'>
            In {daysUntil} {daysUntil === 1 ? 'Day' : 'Days'}
          </div>
        )}

        {showCheckInOption && (
          <div className='flex items-center'>
            <input
              type='checkbox'
              id={`checkin-${id}`}
              checked={checkedIn}
              onChange={() => onCheckIn && onCheckIn(id)}
              className='mr-2 h-4 w-4'
            />
            <label htmlFor={`checkin-${id}`} className='text-sm text-white'>
              check-in
            </label>
          </div>
        )}
      </div>

      <div className='mt-4 flex items-center justify-between'>
        {checkedIn && (
          <div className='flex items-center text-green-400'>
            <Check className='h-4 w-4 mr-1' />
            <span>Checked In</span>
          </div>
        )}

        <div className={checkedIn ? 'ml-auto' : ''}>
          <Link href={`/bookings/${id}`} passHref>
            <Button variant='bluely' className='px-6'>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
