import { HotelRoom } from '../../interface';
import { Button } from './ui/button';

interface RoomCardProps {
  room: HotelRoom;
  type?: 'view' | 'manage';
  onSelectRoom?: (room: HotelRoom) => void;
  onManageRoom?: (room: HotelRoom) => void;
}

export default function RoomCard({
  room,
  type,
  onSelectRoom,
  onManageRoom,
}: RoomCardProps) {
  return (
    <div className='w-[70%] bg-gradient-to-r font-detail from-gold-gd1 to-gold-gd2 rounded-lg shadow overflow-hidden'>
      <div className='relative h-44 bg-gray-600'>
        <img
          src={room.picture || '/img/hotel.jpg'}
          alt={room.roomType}
          className='w-full h-full object-cover'
        />
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
          <p className='mt-3 text-sm text-gray-600'>
            {room.maxCount} rooms available
          </p>
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
            >
              Select Room
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
