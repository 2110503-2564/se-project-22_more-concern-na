import { useState } from 'react';
import ReplyDropDown from './ReplyDropDown';

import { IReply } from '../../interface';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';

interface HotelReplyProps {
  reply: IReply;
}

export default function HotelReply({ reply }: HotelReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(reply.text);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className='relative ml-12 border-l-4 border-yellow-500 bg-[#303646] rounded-sm px-4 pt-3 pb-6 mt-4 mb-8'>
      <div className='absolute text-white top-2 right-6'>
        <ReplyDropDown replyId={reply._id} />
      </div>

      <div className='flex items-center mb-3'>
        <p className='text-xl text-[#FFD400]'>{} Response</p>
      </div>

      {isEditing ? (
        <div>
          <textarea
            className='w-full p-2 text-black bg-gray-100 rounded'
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
          />
          <div className='flex gap-2 mt-2'>
            <Button variant='default'>Save Change</Button>
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
        <p className='font-normal text-sm text-[#d7d7d7]'>{}</p>
      )}
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={() => console.log('Confirmed delete')}
      />
    </div>
  );
}
