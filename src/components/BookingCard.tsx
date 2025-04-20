import { Calendar, Check, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface BookingCardProps {
  id: string;
  hotelName?: string | null;
  checkInDate: Date;
  checkOutDate: Date;
  location?: string | null;
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

  const isHotelMissing = !hotelName;
  const isLocationMissing = !location;

  return (
    <div className='w-full bg-bg-box border border-bg-border bg-opacity-30 p-4 rounded-lg font-detail'>
      <div className='flex justify-between items-start'>
        <div>
          {/* Hotel Name Section */}
          {isHotelMissing ? (
            <div className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-amber-400' />
              <h3 className='text-xl font-semibold font-heading text-amber-400'>
                Hotel Information Missing
              </h3>
            </div>
          ) : (
            <h3 className='text-xl font-semibold font-heading text-white'>
              {hotelName}
            </h3>
          )}

          <div className='mt-3 text-gray-300 space-y-2'>
            <div className='flex items-center'>
              <Calendar className='h-4 w-4 mr-2' />
              <span>check-in: {formatDate(checkInDate)}</span>
            </div>

            <div className='flex items-center'>
              <Calendar className='h-4 w-4 mr-2' />
              <span>check-out: {formatDate(checkOutDate)}</span>
            </div>

            {/* Location Section */}
            <div className='flex items-center'>
              <MapPin className='h-4 w-4 mr-2' />
              {isLocationMissing ? (
                <span className='text-amber-400'>Location information unavailable</span>
              ) : (
                <span>{location}</span>
              )}
            </div>
          </div>
          
          {/* Warning Message when hotel or location is missing */}
          {(isHotelMissing || isLocationMissing) && (
            <div className='mt-2 text-xs text-amber-400 bg-amber-900 bg-opacity-30 p-2 rounded border border-amber-700'>
              Some booking information is missing. Please contact support for assistance.
            </div>
          )}
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