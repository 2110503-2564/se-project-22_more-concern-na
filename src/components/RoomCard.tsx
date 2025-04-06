import { Button } from './ui/button';

interface Room {
  roomType: string;
  picture?: string;
  capacity: number;
  maxCount: number;
  remainCount: number;
  price: number;
}

interface RoomCardProps {
  room: Room;
  onSelectRoom: (room: Room) => void;
}

export default function RoomCard({ room, onSelectRoom }: RoomCardProps) {
  return (
    <div className='w-[70%] bg-purple-400 rounded-lg shadow overflow-hidden'>
      <div className='relative h-44 bg-gray-600'>
        <img
          src={room.picture || '/img/hotel.jpg'}
          alt={room.roomType}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-4'>
        <div className='flex justify-between'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {room.roomType}
          </h2>
          <div className='text-right'>
            <p className='text-md font-medium text-gray-800'>{room.price}</p>
            <p className='text-md font-medium text-gray-800'>per night</p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-sm text-gray-600'>Max {room.capacity} persons</p>
        </div>
        <div className='mt-4 flex justify-between'>
          <p className='mt-3 text-sm text-gray-600'>
            {room.remainCount} rooms available
          </p>
          <Button
            variant='default'
            onClick={() => onSelectRoom(room)}
            className='bg-blue-600 ml-7 text-white text-sm px-8 py-2 rounded hover:bg-blue-700'
          >
            Select Room
          </Button>
        </div>
      </div>
    </div>
  );
}
