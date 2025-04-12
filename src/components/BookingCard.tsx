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
  daysUntil?: number;
}

export const BookingCard = ({
  id,
  hotelName,
  checkInDate,
  checkOutDate,
  location,
  type,
  daysUntil,
}: BookingCardProps) => {
  // Format the dates for display in the format "Apr 9, 2025"
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