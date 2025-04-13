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
import { deleteHotel } from '@/lib/hotelService';
import { MapPin, Phone, Star, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IHotel } from '../../interface';
import { Button } from './ui/button';

interface hotelCardProps {
  hotel: IHotel;
  type?: 'view' | 'edit';
}

export default function HotelCard({ hotel, type }: hotelCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // To handle loading state for delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Controls confirmation dialog
  const { data: session } = useSession(); // Assuming you have a session management in place
  const handleClick = () => {
    if (type === 'view') {
      router.push(`/hotels/${hotel._id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/manage/hotel/${hotel._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    if (!hotel._id) {
      console.error('Hotel ID is missing.');
      return;
    }
    setLoading(true);
    try {
      await deleteHotel(hotel._id, (session as any)?.user?.token);
      setIsConfirmOpen(false);
      router.push('/hotels');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const formatPhone = (phoneNumber: string) => {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  };

  const fullAddress = `${hotel.buildingNumber} ${hotel.street}, ${hotel.district}, ${hotel.province} ${hotel.postalCode}`;

  const averageRating =
    hotel.ratingCount > 0
      ? (hotel.ratingSum / hotel.ratingCount).toFixed(1)
      : '0.0';

  return (
    <div
      className='max-w-sm relative overflow-hidden bg-gradient-to-r from-gold-gd1 to-gold-gd2 rounded-lg text-cardfont-detail font-detail'
      onClick={handleClick}
    >
      <div className='rounded-t-lg h-44 bg-gray-600'>
        <img
          src={hotel.picture || '/img/hotel.jpg'}
          alt={hotel.name}
          className='w-full h-full object-cover rounded-t-lg'
        />
        {type === 'edit' && (
          <Button
            variant='ghost'
            size='icon'
            onClick={handleDelete}
            className='absolute top-2 right-2 bg-[#a52a2a] text-white hover:bg-white hover:text-[#a52a2a] rounded-full p-1'
          >
            <X className='w-5 h-5' />
          </Button>
        )}
      </div>
      <div className='p-4 h-56 relative'>
        <div className='absolute top-2 right-2 px-2 py-1 rounded flex items-center'>
          <Star size={16} />
          <span className='ml-1 font-semibold'>{averageRating}</span>
        </div>
        <div className='absolute bottom-2 left-2 px-2 py-1'>
          <span className='text-sm font-medium'>
            {hotel.ratingCount} reviews
          </span>
        </div>
        <h2 className='text-2xl font-semibold text-cardfont-cl mt-4 mb-2'>
          {hotel.name}
        </h2>
        <div className='flex items-center mb-2'>
          <MapPin className='w-5 h-5' />
          <span className='ml-2 font-medium'>{fullAddress}</span>
        </div>
        <div className='flex items-center'>
          <Phone className='w-5 h-5' />
          <span className='ml-2 font-medium'>{formatPhone(hotel.tel)}</span>
        </div>
      </div>

      {type === 'edit' && (
        <div className='absolute bottom-2 right-2'>
          <Button
            variant='default'
            onClick={handleEdit}
            className='bg-bg-btn ml-7 text-white text-sm px-8 py-2 rounded hover:bg-blue-700'
          >
            Edit
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className='bg-bg-box border-bg-border text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white font-heading text-2xl'>
              Confirm Deletion
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='text-gray-300 font-detail'>
            <div className='space-y-4 py-2'>
              <h3 className='font-medium text-luxe-gold mb-2'>
                Are you sure you want to delete this hotel?
              </h3>
              <div className='text-sm space-y-2'>
                <div className='flex justify-between'>
                  <span>Hotel Name:</span>
                  <span className='font-medium'>{hotel.name}</span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel
              className='border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'
              onClick={cancelDelete}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
              onClick={confirmDelete}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
