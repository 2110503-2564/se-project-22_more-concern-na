'use client';

import { Rating } from '@mui/material';
import dayjs from 'dayjs';
import { Reply, Trash } from 'lucide-react';
import { useState } from 'react';
import HotelReply from './HotelReply';
import ReviewDropDown from './ReviewDropDown';
import { Button } from './ui/button';

import { useSession } from 'next-auth/react';
import { IReview } from '../../interface';
import AlertConfirmation from './AlertConfirmation';

interface ReviewProps {
  review: IReview;
  isReported?: boolean;
}

export default function Review({ review, isReported = false }: ReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(review.text);
  const [title, setTitle] = useState(review.title);
  const [rating, setRating] = useState(review.rating);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: session } = useSession();

  const isHotelManager = session
    ? (session.user as any)?.data.role === 'hotelManager' &&
      (session.user as any)?.data.hotel === review.booking?.hotel
    : false;
  const isReviewOwner = session
    ? (session.user as any)?.data.email === review.booking?.user.email
    : false;

  const handleEdit = () => {};

  const handleSaveEdit = () => {};

  const handleDelete = () => {};

  const handleReport = (reason: string) => {};

  return (
    <div>
      <div className='relative bg-[#434A5B] text-white font-detail rounded-sm px-6 pt-6 mb-4 shadow'>
        <div className='absolute top-2 right-6'>
          {isReported ? (
            <Trash className='text-[#a52a2a] bg-white hover:bg-[#a52a2a] hover:text-white rounded-full p-1' />
          ) : (
            <ReviewDropDown
              reviewId={review._id}
              onEdit={isReviewOwner ? handleEdit : undefined}
              onDelete={isReviewOwner ? handleDelete : undefined}
              onReport={isHotelManager ? handleReport : undefined}
            />
          )}
        </div>
        <div className='flex items-center'>
          <img
            src={review.booking?.user.picture || '/default-avatar.png'}
            alt={`${review.booking?.user.name}'s avatar`}
            className='w-[50px] h-[50px] rounded-full mr-3'
          />
          <div>
            <h3 className='text-xl font-heading font-semibold'>
              {review.booking?.user.name}
            </h3>
            <p className='text-sm text-gray-400'>
              Stayed {dayjs(review.booking?.startDate).format('MMMM YYYY')}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='flex items-center mb-2'>
              <span className='mr-3'>Rating:</span>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 0)}
                precision={1}
              />
              <span className='ml-2 text-sm text-gray-300'>{rating} / 5</span>
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-semibold mb-1'>
                Comment
              </label>
              <textarea
                className='w-full p-2 text-black bg-gray-100 rounded'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className='flex space-x-3 pb-5'>
              <Button variant='default' onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant='secondary'>Cancel</Button>
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
            <p className='mt-2 pb-6 text-base'>"{review.text}"</p>
          </>
        )}

        {isHotelManager && !review.reply && !isReported && (
          <div className='flex justify-end'>
            <Button variant='link' className='text-white'>
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
            <Button variant='default'>Submit Reply</Button>
            <Button variant='secondary'>Cancel</Button>
          </div>
        </div>
      )}
      {review.reply && !isReported && <HotelReply reply={review.reply} />}
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={() => console.log('Confirmed delete')}
      />
    </div>
  );
}
