'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getRoom, updateRoom, deleteRoom } from '@/lib/roomService';
import { HotelRoom } from '@/../interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

export default function EditRoom({
  params,
}: {
  params: Promise<{ hotelid: string; roomid: string }>;
}) {
  const [room, setRoom] = useState<HotelRoom | null>(null);
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  useEffect(() => {
    const fetchRoom = async () => {
      const { hotelid, roomid } = await params;
      const fetchedRoom = await getRoom(hotelid, roomid);
      if (fetchedRoom) {
        setRoom(fetchedRoom);
        setRoomType(fetchedRoom.roomType);
        setCapacity(fetchedRoom.capacity);
        setPrice(fetchedRoom.price);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [params]);

  const handleSave = async () => {
    if (!room || !token) return;
    const { hotelid } = await params;
    console.log('hotelid', hotelid);
    try {
      const res = await updateRoom(
        hotelid,
        room._id!,
        {
          roomType,
          capacity,
          price,
        },
        token,
      );

      if (res.success) {
        toast.success('Room updated successfully');
        router.back();
      } else {
        toast.error(res.msg || 'Failed to update room');
      }
    } catch (error: any) {
      toast.error(error.message || 'Unexpected error occurred');
    }
  };

  const handleDelete = async () => {
    if (!room || !token) return;
    const { hotelid } = await params;
    try {
      const res = await deleteRoom(hotelid, room._id!, token);

      if (res.success) {
        toast.success('Room deleted successfully');
        router.push(`/manage/hotels/${hotelid}`);
      } else {
        toast.error(res.msg || 'Failed to delete room');
      }
    } catch (error: any) {
      toast.error(error.message || 'Unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-gd text-white px-4 py-12 flex flex-col items-center font-detail)]">
      <div className="w-full max-w-md">
        <a
          href="#"
          onClick={() => router.back()}
          className="text-x1 text-white mb-6 inline-block hover:underline font-detail"
        >
          ← Back to Manage Bookings
        </a>
        <div className="bg-box p-8 rounded-md border border-bg-border shadow">
          <h2 className="text-2xl text-center mb-6 font-heading">
            Edit Room
          </h2>

          <div className="mb-4">
            <label className="block text-x1 mb-1 font-detail">Room Type</label>
            <input
              placeholder='roomType'
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-200 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-x1 mb-1 font-detail">Max Guest</label>
            <input
              placeholder='Capacity'
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-gray-200 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-x1 mb-1 font-detail">Baht per night</label>
            <input
              placeholder='Price'
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-gray-200 text-black"
            />
          </div>

          <Button
            onClick={handleSave}
            variant="golden"
            className="w-full"
          >
            Save Changes
          </Button>
        </div>

        <Button
          onClick={handleDelete}
          className="w-full py-2 rounded-md mt-6 bg-[#991B1B] hover:bg-[#B91C1C] text-white font-detail"
        >
          Delete Room
        </Button>
      </div>
    </div>
  );
}