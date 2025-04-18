import { useState } from 'react';
import ReplyDropDown from './ReplyDropDown';

import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';

export interface HotelReplyType {
  id: number;
  hotelName: string;
  avatarUrl?: string;
  date: string;
  comment: string;
}

interface HotelReplyProps {
  reply: HotelReplyType;
  onDeleteReply?: (replyId: number) => void;
  onUpdateReply?: (updatedReply: HotelReplyType) => void;
}

export default function HotelReply({
  reply,
  onDeleteReply,
  onUpdateReply,
}: HotelReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(reply.comment);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditReply = (replyId: number) => {
    setIsEditing(true);
  };

  const handleDeleteReply = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteReply = async () => {
    setIsDeleteDialogOpen(false);
    try {
      // TODO: call backend to delete the reply
      // await fetch(`/api/hotel-reply/${replyId}`, {
      //   method: 'DELETE',
      // });
      if (onDeleteReply) {
        onDeleteReply(reply.id);
      } else {
        alert('Reply deleted! (placeholder)');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEditedReply = async () => {
    try {
      // TODO: call backend to update the reply
      // await fetch(`/api/hotel-reply/${reply.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ comment: editedReply }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      reply.comment = editedReply;
      setIsEditing(false);

      if (onUpdateReply) {
        onUpdateReply(reply);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='relative ml-12 border-l-4 border-yellow-500 bg-[#303646] rounded-sm px-4 pt-3 pb-6 mt-4 mb-8'>
      <div className='absolute text-white top-2 right-6'>
        <ReplyDropDown
          replyId={reply.id}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
        />
      </div>

      <div className='flex items-center mb-3'>
        <p className='text-xl text-[#FFD400]'>{reply.hotelName} Response</p>
      </div>

      {isEditing ? (
        <div>
          <textarea
            className='w-full p-2 text-black bg-gray-100 rounded'
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
          />
          <div className='flex gap-2 mt-2'>
            <Button variant='default' onClick={handleSaveEditedReply}>
              Save Change
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                setEditedReply(reply.comment);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className='font-normal text-sm text-[#d7d7d7]'>{reply.comment}</p>
      )}
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={confirmDeleteReply}
      />
    </div>
  );
}
