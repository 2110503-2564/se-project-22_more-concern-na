import { Rooms } from '../../interface';
import { Button } from './ui/button';

interface RoomCardProps {
  room: Rooms;
  type?: 'view' | 'manage';
  onSelectRoom?: (room: Rooms) => void;
  onManageRoom?: (room: Rooms) => void;
  availability?: {
    checkedDates: boolean;
    availableCount: number | null;
  };
}

export default function RoomCard({
  room,
  type,
  onSelectRoom,
  onManageRoom,
  availability,
}: RoomCardProps) {
  return (
    <div className='w-[70%] bg-gradient-to-r font-detail from-gold-gd1 to-gold-gd2 rounded-lg shadow overflow-hidden'>
      <div className='relative h-44 bg-gray-600'>
        <img
          src={room.picture || '/defaultRoom.jpg'}
          alt={room.roomType}
          className='w-full h-full object-cover'
        />
        {availability?.checkedDates && (
          <div
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
              availability.availableCount && availability.availableCount > 0
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {availability.availableCount && availability.availableCount > 0
              ? `${availability.availableCount} Available`
              : 'Not Available'}
          </div>
        )}
      </div>
      <div className='p-4'>
        <div className='flex justify-between'>
          <h2 className='text-xl font-bold font-heading text-gray-800'>
            {room.roomType}
          </h2>
          <div className='text-right'>
            <p className='text-lg font-semibold text-gray-800'>${room.price}</p>
            <p className='text-md font-medium text-gray-800'>per night</p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-sm text-gray-600'>Max {room.capacity} persons</p>
        </div>
        <div className='mt-4 flex justify-between'>
          {availability?.checkedDates ? (
            <p className='mt-3 text-sm text-gray-600'>
              {availability.availableCount && availability.availableCount > 0
                ? `${availability.availableCount} rooms available`
                : 'No rooms available'}
            </p>
          ) : (
            <p className='mt-3 text-sm text-gray-600'>
              {room.maxCount} rooms total
            </p>
          )}
          {type === 'manage' ? (
            <Button
              variant='bluely'
              onClick={() => onManageRoom?.(room)}
              className='ml-7 w-[55%]'
            >
              Manage Room
            </Button>
          ) : (
            <Button
              variant='bluely'
              onClick={() => onSelectRoom?.(room)}
              className='ml-7 w-[55%]'
              disabled={
                availability?.checkedDates &&
                (!availability.availableCount ||
                  availability.availableCount <= 0)
              }
            >
              {availability?.checkedDates &&
              (!availability.availableCount || availability.availableCount <= 0)
                ? 'Not Available'
                : 'Select Room'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
