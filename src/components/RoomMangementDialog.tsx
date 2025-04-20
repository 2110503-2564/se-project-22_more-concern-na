'use client';
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
import { Button } from '@/components/ui/button';
import { deleteRoom, updateRoom } from '@/lib/roomService';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Rooms } from '../../interface';

interface RoomEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  room: Rooms;
  token?: string;
  onRoomUpdated: (updatedRoom: Rooms) => void;
  onRoomDeleted?: (roomId: string) => void;
}

export default function RoomMangementDialog({
  isOpen,
  onOpenChange,
  hotelId,
  room,
  token,
  onRoomUpdated,
  onRoomDeleted,
}: RoomEditDialogProps) {
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [maxCount, setMaxCount] = useState<number>(0);
  const [picture, setPicture] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (room) {
      setRoomType(room.roomType || '');
      setCapacity(room.capacity || 0);
      setPrice(room.price || 0);
      setMaxCount(room.maxCount || 0);
      setPicture(room.picture || '');
    }
  }, [room]);

  const handleUpdateRoom = async () => {
    if (!room._id) return;

    try {
      const updatedRoomData: Partial<Rooms> = {
        roomType,
        capacity,
        price,
        maxCount,
        picture,
      };

      const res = await updateRoom(hotelId, room._id, updatedRoomData, token);

      if (res.success) {
        toast.success('Room updated successfully');
        onRoomUpdated({
          ...room,
          ...updatedRoomData,
        });
        onOpenChange(false);
      } else {
        toast.error('Update failed', {
          description: res.msg || 'Something went wrong',
        });
      }
    } catch (err: any) {
      toast.error('Update failed', {
        description: err.message || 'Something went wrong',
      });
    }
  };

  const handleDeleteRoom = async () => {
    if (!room._id) return;

    try {
      const res = await deleteRoom(hotelId, room._id, token);

      if (res.success) {
        toast.success('Room deleted successfully');
        setIsDeleteDialogOpen(false);
        onOpenChange(false);
        if (onRoomDeleted) {
          onRoomDeleted(room._id);
        }
      } else {
        toast.error('Delete failed', {
          description: res.msg || 'Something went wrong',
        });
      }
    } catch (err: any) {
      toast.error('Delete failed', {
        description: err.message || 'Something went wrong',
      });
    }
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className='bg-bg-box border-bg-border text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white font-heading text-2xl'>
              Edit Room Details
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-300 font-detail'>
              Update the details for this room type.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='space-y-4 py-4'>
            <div className='mb-4'>
              <label
                htmlFor='roomType'
                className='block text-sm font-detail mb-1'
              >
                Room Type
              </label>
              <input
                id='roomType'
                type='text'
                placeholder='Enter room type'
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className='w-full p-2 rounded-md bg-gray-300 text-black'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='capacity'
                  className='block text-sm font-detail mb-1'
                >
                  Capacity
                </label>
                <input
                  id='capacity'
                  type='number'
                  placeholder='Max persons'
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className='w-full p-2 rounded-md bg-gray-300 text-black'
                />
              </div>
              <div>
                <label
                  htmlFor='maxCount'
                  className='block text-sm font-detail mb-1'
                >
                  Available Rooms
                </label>
                <input
                  id='maxCount'
                  type='number'
                  placeholder='Number of rooms'
                  value={maxCount}
                  onChange={(e) => setMaxCount(parseInt(e.target.value))}
                  className='w-full p-2 rounded-md bg-gray-300 text-black'
                />
              </div>
            </div>

            <div>
              <label htmlFor='price' className='block text-sm font-detail mb-1'>
                Price (per night)
              </label>
              <input
                id='price'
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className='w-full p-2 rounded-md bg-gray-300 text-black'
              />
            </div>

            <div>
              <label
                htmlFor='picture'
                className='block text-sm font-detail mb-1'
              >
                Picture URL
              </label>
              <input
                id='picture'
                type='text'
                placeholder='Enter image URL'
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className='w-full p-2 rounded-md bg-gray-300 text-black'
              />
            </div>

            <div className='mt-6 p-4 bg-[#2A2F3F] rounded-md'>
              <h3 className='font-medium text-luxe-gold mb-2'>Room Summary</h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-400'>Room Type:</span>
                  <p className='font-medium'>{roomType}</p>
                </div>
                <div>
                  <span className='text-gray-400'>Price:</span>
                  <p className='font-medium'>${price}/night</p>
                </div>
                <div>
                  <span className='text-gray-400'>Capacity:</span>
                  <p className='font-medium'>{capacity} persons</p>
                </div>
                <div>
                  <span className='text-gray-400'>Available Rooms:</span>
                  <p className='font-medium'>{maxCount}</p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className='flex justify-between'>
            <Button
              variant='destructive'
              onClick={() => setIsDeleteDialogOpen(true)}
              className='bg-red-600 hover:bg-red-700 flex items-center gap-2'
            >
              <Trash2 size={16} />
              Delete Room
            </Button>
            <div className='flex gap-2'>
              <AlertDialogCancel className='border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className='bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
                onClick={handleUpdateRoom}
              >
                Update Room
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className='bg-bg-box border-bg-border text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white font-heading text-2xl'>
              Delete Room
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-300 font-detail'>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='my-4 p-4 bg-[#2A2F3F] rounded-md'>
            <h3 className='font-medium text-red-400 mb-2'>
              Room to be deleted:
            </h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-400'>Room Type:</span>
                <p className='font-medium'>{roomType}</p>
              </div>
              <div>
                <span className='text-gray-400'>Price:</span>
                <p className='font-medium'>${price}/night</p>
              </div>
            </div>
            <p className='text-xs text-gray-400 mt-4'>
              Warning: Deleting this room will also remove all related bookings
              and availability data.
            </p>
          </div>

          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel className='border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700 text-white'
              onClick={handleDeleteRoom}
            >
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
