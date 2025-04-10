import { Rating } from '@mui/material';
import dayjs from 'dayjs';
import { Reply } from 'lucide-react';
import { useState } from 'react';
import HotelReply, { HotelReplyType } from './HotelReply';
import ReviewDropDown from './ReviewDropDown';
import { Button } from './ui/button';

import AlertConfirmation from './AlertConfirmation';

export interface ReviewType {
  id: number;
  username: string;
  avatarUrl?: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  reply?: HotelReplyType;
}

interface ReviewProps {
  review: ReviewType;
  onDeleteReview?: (reviewId: number) => void;
  onUpdateReview?: (updatedReview: ReviewType) => void;
  onDeleteReply?: (reviewId: number, replyId: number) => void;
}

export default function Review({
  review,
  onDeleteReview,
  onUpdateReview,
  onDeleteReply,
}: ReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);
  const [editedTitle, setEditedTitle] = useState(review.title);
  const [editedRating, setEditedRating] = useState(review.rating);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isHotelManager = true;

  const handleEdit = async (reviewId: number) => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      // TODO: call backend to update the review
      // await fetch(`/api/reviews/${review.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ comment: editedComment }),
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // For now, just close out the editing state:
      review.title = editedTitle;
      review.rating = editedRating;
      review.comment = editedComment;
      setIsEditing(false);

      if (onUpdateReview) {
        onUpdateReview(review);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditedTitle(review.title);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteReview = async () => {
    setIsDeleteDialogOpen(false);
    try {
      // TODO: call backend to delete the review
      // await fetch(`/api/reviews/${review.id}`, {
      //   method: 'DELETE',
      // });
      // Then remove it from UI or tell parent to refresh
      if (onDeleteReview) {
        onDeleteReview(review.id);
      } else {
        alert('Review deleted! (placeholder)');
      }
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  const handleReport = async (reviewId: number, reason: string) => {
    try {
      // TODO: call backend to report the review
      // await fetch(`/api/reviews/report/${review.id}`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reason }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      alert(`Reported review for "${reason}" (placeholder)`);
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  const handleOpenReplyForm = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyContent('');
  };

  const handleSubmitReply = async () => {
    // Example new reply object (IDs, hotelName, date, etc. can vary):
    const newReply: HotelReplyType = {
      id: Math.floor(Math.random() * 100000), // placeholder
      hotelName: 'Hotel Sunshine Luxury Resort', // or from real data
      date: dayjs().format('YYYY-MM-DD'),
      avatarUrl: '/hotel-logo.png',
      comment: replyContent,
    };

    try {
      // TODO: call backend e.g.:
      // await fetch(`/api/replies`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reviewId: review.id, comment: replyContent }),
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // Add the reply to the review
      review.reply = newReply;
      if (onUpdateReview) onUpdateReview(review);

      // reset the form
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit reply.');
    }
  };

  return (
    <div>
      <div className='relative bg-[#434A5B] text-white font-detail rounded-sm px-6 pt-6 mb-4 shadow'>
        <div className='absolute top-2 right-6'>
          <ReviewDropDown
            reviewId={review.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        </div>
        <div className='flex items-center'>
          <img
            src={review.avatarUrl || '/default-avatar.png'}
            alt={`${review.username}'s avatar`}
            className='w-[50px] h-[50px] rounded-full mr-3'
          />
          <div>
            <h3 className='text-xl font-heading font-semibold'>
              {review.username}
            </h3>
            <p className='text-sm text-gray-400'>
              Stayed {dayjs(review.date).format('MMMM YYYY')}
            </p>
          </div>
        </div>
        {isEditing ? (
          // Edit form
          <div className='mt-4'>
            <div className='mb-2'>
              <label className='block text-sm font-semibold mb-1'>
                Review Title
              </label>
              <input
                className='w-fit p-2 text-black bg-gray-100 rounded'
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>

            <div className='flex items-center mb-2'>
              <span className='mr-3'>Rating:</span>
              <Rating
                value={editedRating}
                onChange={(_, newValue) => setEditedRating(newValue || 0)}
                precision={1}
              />
              <span className='ml-2 text-sm text-gray-300'>
                {editedRating} / 5
              </span>
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-semibold mb-1'>
                Comment
              </label>
              <textarea
                className='w-full p-2 text-black bg-gray-100 rounded'
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
            </div>

            <div className='flex space-x-3 pb-5'>
              <Button variant='default' onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant='secondary' onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Normal display
          <>
            <div className='mt-2 flex items-center'>
              <h4 className='text-xl font-medium font-heading mr-3'>
                {review.title}
              </h4>
              <Rating
                value={review.rating}
                readOnly
                precision={1}
                size='small'
              />
            </div>
            <p className='mt-2 pb-6 text-base'>"{review.comment}"</p>
          </>
        )}

        {isHotelManager && !review.reply && (
          <div className='flex justify-end'>
            <Button
              variant='link'
              className='text-white'
              onClick={handleOpenReplyForm}
            >
              <Reply /> Reply
            </Button>
          </div>
        )}
      </div>
      {showReplyForm && !review.reply && (
        <div className='ml-12 border-l-4 border-yellow-500 bg-[#303646] rounded-sm px-4 pt-3 pb-6 mb-4'>
          <h4 className='text-lg font-semibold text-[#FFD400] mb-2'>
            Write a Reply
          </h4>
          <textarea
            className='w-full p-2 bg-gray-100 text-black rounded'
            rows={3}
            placeholder='Write your reply here...'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className='flex gap-2 mt-3'>
            <Button variant='default' onClick={handleSubmitReply}>
              Submit Reply
            </Button>
            <Button variant='secondary' onClick={handleCancelReply}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {review.reply && (
        <HotelReply
          reply={review.reply}
          onDeleteReply={(replyId) => {
            onDeleteReply?.(review.id, replyId);
          }}
        />
      )}
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={confirmDeleteReview}
      />
    </div>
  );
}
