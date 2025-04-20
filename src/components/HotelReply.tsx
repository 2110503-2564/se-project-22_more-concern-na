'use client';

import { useState } from 'react';
import ReplyDropDown from './ReplyDropDown';

import { updateReply } from '@/lib/reviewService';
import { useSession } from 'next-auth/react';
import { IReview } from '../../interface';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';

interface HotelReplyProps {
  review: IReview;
  parentHandleDeleteReply: () => void;
  isHotelManager?: boolean;
}

export default function HotelReply({
  review,
  parentHandleDeleteReply,
  isHotelManager,
}: HotelReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(review.reply?.text || '');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: session } = useSession();

  const handleEdit = async () => {
    setIsEditing(false);
    await updateReply(
      review._id || '',
      { text: editedReply },
      (session as any)?.user?.token,
    );
  };

  return (
    <div className='relative ml-12 border-l-4 border-yellow-500 bg-[#303646] rounded-sm px-4 pt-3 pb-6 mt-4 mb-8'>
      {isHotelManager && (
        <div className='absolute text-white top-2 right-6'>
          <ReplyDropDown
            replyId={review.reply?._id || ''}
            onEditReply={() => setIsEditing(true)}
            onDeleteReply={() => setIsDeleteDialogOpen(true)}
          />
        </div>
      )}

      <div className='flex items-center mb-3'>
        <p className='text-sm text-[#FFD400] font-heading'>
          Response from Hotel Manager
        </p>
      </div>

      {isEditing ? (
        <div>
          <textarea
            className='w-full p-2 text-black bg-gray-100 rounded'
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
          />
          <div className='flex gap-2 mt-2'>
            <Button variant='default' onClick={() => setIsEditDialogOpen(true)}>
              Save Change
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className='font-detail text-[#d7d7d7] text-lg'>{editedReply}</p>
      )}
      <AlertConfirmation
        onOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        type='edit'
        onConfirm={handleEdit}
      />

      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={parentHandleDeleteReply}
      />
    </div>
  );
}
