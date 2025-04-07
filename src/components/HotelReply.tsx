import { useState } from 'react';
import ReplyDropDown from './ReplyDropDown';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
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

export default function HotelReply({ reply, onDeleteReply, onUpdateReply }: HotelReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(reply.comment);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditReply = (replyId: number) => {
    setIsEditing(true);
  };

  const handleDeleteReply = () => {
    setIsDeleteDialogOpen(true);
  }

  const confirmDeleteReply = async () => {
    setIsDeleteDialogOpen(false);
    try {
      // TODO: call backend to delete the reply
      // await fetch(`/api/hotel-reply/${replyId}`, {
      //   method: 'DELETE',
      // });
      if(onDeleteReply) {
        onDeleteReply(reply.id);
      }else{
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

      if (onUpdateReply){
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
        <p className='text-xl text-[#FFD400]'>
          {reply.hotelName} Response
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
            <Button variant='default' onClick={handleSaveEditedReply}>
              Save Change
            </Button>
            <Button variant='secondary' onClick={() => {
                setEditedReply(reply.comment);
                setIsEditing(false);
              }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className='font-normal text-sm text-[#d7d7d7]'>{reply.comment}</p>
      )}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-bg-box border text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-gold-gd1 font-heading">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 font-medium text-base font-detail">
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className='border-gray-600 font-detail text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteReply}
              className='font-detail text-sm font-medium bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
