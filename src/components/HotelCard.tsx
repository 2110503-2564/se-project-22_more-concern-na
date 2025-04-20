'use client';
import { MapPin, Phone, Star, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IHotel } from '../../interface';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';

interface hotelCardProps {
  hotel: IHotel;
  type?: 'view' | 'edit';
  onDelete?: (hotelId: string) => void;
}

export default function HotelCard({ hotel, type, onDelete }: hotelCardProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (type === 'view') {
      router.push(`/hotels/${hotel._id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/manage/hotels/${hotel._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (hotel._id && onDelete) {
      await onDelete(hotel._id);
    }
    setIsDeleteDialogOpen(false);
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
      className='w-full max-w-sm h-96 relative overflow-hidden bg-gradient-to-r from-gold-gd1 to-gold-gd2 rounded-lg text-cardfont-detail font-detail cursor-pointer shadow-md'
      onClick={handleClick}
    >
      {/* Fixed height image container */}
      <div className='w-full h-44 relative overflow-hidden bg-gray-600'>
        <img
          src={hotel.picture || '/img/hotel.png'}
          alt={hotel.name}
          className='w-full h-full object-cover rounded-t-lg'
        />
        {type === 'edit' && (
          <Button
            variant='ghost'
            size='icon'
            onClick={handleDelete}
            className='absolute top-2 right-2 bg-[#a52a2a] text-white hover:bg-white hover:text-[#a52a2a] rounded-full p-1 z-10'
          >
            <X className='w-5 h-5' />
          </Button>
        )}
      </div>
      
      {/* Fixed height content section */}
      <div className='p-4 h-52 relative'>
        <div className='absolute top-2 right-2 px-2 py-1 rounded flex items-center'>
          <Star size={16} />
          <span className='ml-1 font-semibold'>{averageRating}</span>
        </div>
        <h2 className='text-xl font-semibold text-cardfont-cl mt-2 mb-2 line-clamp-1'>
          {hotel.name}
        </h2>
        <div className='flex items-start mb-2'>
          <MapPin className='w-4 h-4 mt-1 flex-shrink-0' />
          <span className='ml-2 font-medium text-sm line-clamp-2'>{fullAddress}</span>
        </div>
        <div className='flex items-center'>
          <Phone className='w-4 h-4 flex-shrink-0' />
          <span className='ml-2 font-medium text-sm'>{formatPhone(hotel.tel)}</span>
        </div>
        <div className='absolute bottom-2 left-2 px-2 py-1'>
          <span className='text-sm font-medium'>
            {hotel.ratingCount} reviews
          </span>
        </div>
      </div>

      {type === 'edit' && (
        <div className='absolute bottom-2 right-2'>
          <Button
            variant='default'
            onClick={handleEdit}
            className='bg-bg-btn text-white text-sm px-4 py-1 rounded hover:bg-blue-700'
          >
            Edit
          </Button>
        </div>
      )}
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={confirmDelete}
      />
    </div>
  );
}