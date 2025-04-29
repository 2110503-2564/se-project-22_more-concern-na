'use client';

import { Rating } from '@mui/material';
import dayjs from 'dayjs';
import { Eye, EyeClosed, Reply, Trash } from 'lucide-react';
import { useState } from 'react';
import HotelReply from './HotelReply';
import ReviewDropDown from './ReviewDropDown';
import { Button } from './ui/button';

import { addReport } from '@/lib/reportService';
import {
  addReply,
  deleteReply,
  deleteReview,
  updateReview,
} from '@/lib/reviewService';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { IReview } from '../../interface';
import AlertConfirmation from './AlertConfirmation';

interface ReviewProps {
  review: IReview;
  handleDeleteFromList?: (reviewId: string) => void;
  handleIgnoreFromReport?: (ignore: boolean) => void;
  isReported?: boolean;
  ignore?: boolean;
}

export default function Review({
  review,
  handleDeleteFromList,
  handleIgnoreFromReport,
  isReported,
  ignore,
}: ReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isIgnored, setIsIgnored] = useState(ignore);
  const [text, setText] = useState(review.text);
  const [title, setTitle] = useState(review.title);
  const [rating, setRating] = useState(review.rating);

  const [showReplyCreateForm, setShowReplyCreateForm] = useState(false);
  const [replyContent, setReplyContent] = useState(review.reply?.text);

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isIgnoreDialogOpen, setIsIgnoreDialogOpen] = useState(false);
  const { data: session } = useSession();

  const isHotelManager = session
    ? (session.user as any)?.data.role === 'hotelManager' &&
      (session.user as any)?.data.hotel === review.booking?.hotel
    : false;
  const isReviewOwner = session
    ? (session.user as any)?.data.email === review.booking?.user.email
    : false;

  // --- reply form --- //
  const handleReplySubmit = async () => {
    setShowReplyCreateForm(false);
    if(!replyContent) {
      toast.error('Please fill text in the field');
      setShowReplyCreateForm(true);
      return;
    }
    const res = await addReply(
      review._id,
      { text: replyContent || '' },
      (session as any)?.user?.token,
    );
    if (res.success) {
      toast.success('Reply added successfully');
    }
  };

  // --- editing --- //

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsEditing(false);
    if (title?.trim() === '' || text?.trim() === '' || rating === 0) {
      toast.error("Can not edit. Please fill in all fields");
      setIsEditing(true);
      return;
    }
    const res = await updateReview(
      review._id,
      { title, text, rating },
      (session as any)?.user?.token,
    );
    if (res.success) {
      toast.success('Review updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setText(review.text);
    setTitle(review.title);
    setRating(review.rating);
  };

  // --- deleting --- //

  const handleDelete = async () => {
    handleDeleteFromList && handleDeleteFromList(review._id);
    const res = await deleteReview(review._id, (session as any)?.user?.token);
    if (res.success) {
      toast.success('Review deleted successfully');
    }
  };

  const handleDeleteReply = async () => {
    setReplyContent(undefined);
    const res = await deleteReply(review._id, (session as any)?.user?.token);
    if(res.success) {
      toast.success('Reply deleted successfully');
    }
  };

  const handleReport = async (reportReason: string) => {
    const res = await addReport({
      review: review._id,
      reportReason,
      token: (session as any)?.user?.token,
    });
    if (res.success) toast.success('Report submitted successfully');
  };

  const handleIgnore = () => {
    setIsIgnored(!isIgnored);
    handleIgnoreFromReport && handleIgnoreFromReport(true);
    setIsIgnoreDialogOpen(false);
  };

  return (
    <div>
      <div
        className={`relative bg-[#434A5B] text-white font-detail rounded-sm px-6 pt-6 mb-4 shadow ${isIgnored ? 'opacity-50' : ''}`}
      >
        <div className='absolute top-2 right-6'>
          {isReported ? (
            <div className='flex items-center gap-2'>
              <Trash
                className='text-[#a52a2a] bg-white hover:bg-[#a52a2a] hover:text-white rounded-full p-1'
                onClick={() => setIsDeleteDialogOpen(true)}
              />
              {isIgnored ? (
                <EyeClosed
                  className='text-[#a52a2a] bg-white hover:bg-[#a52a2a] hover:text-white rounded-full p-1'
                  onClick={() => setIsIgnoreDialogOpen(true)}
                />
              ) : (
                <Eye
                  className='text-[#a52a2a] bg-white hover:bg-[#a52a2a] hover:text-white rounded-full p-1'
                  onClick={() => setIsIgnoreDialogOpen(true)}
                />
              )}
            </div>
          ) : (
            (isReviewOwner || isHotelManager) && (
              <ReviewDropDown
                reviewId={review._id}
                onEdit={isReviewOwner ? handleOpenEdit : undefined}
                onDelete={
                  isReviewOwner ? () => setIsDeleteDialogOpen(true) : undefined
                }
                onReport={isHotelManager ? handleReport : undefined}
              />
            )
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
              <Button
                variant='default'
                onClick={() => setIsEditDialogOpen(true)}
              >
                Save Changes
              </Button>
              <Button variant='secondary' onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Normal display
          <>
            <div className='mt-2 flex items-center'>
              <h4 className='text-xl font-medium font-heading mr-3'>{title}</h4>
              <Rating value={rating} readOnly precision={1} size='small' />
            </div>
            <p className='mt-2 pb-6 text-base'>"{text}"</p>
          </>
        )}

        {isHotelManager &&
          !showReplyCreateForm &&
          !replyContent &&
          !isReported && (
            <div className='flex justify-end'>
              <Button
                variant='link'
                className='text-white'
                onClick={() => setShowReplyCreateForm(true)}
              >
                <Reply /> Reply
              </Button>
            </div>
          )}
      </div>
      {showReplyCreateForm && (
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
            <Button
              variant='default'
              onClick={() => setIsReplyDialogOpen(true)}
            >
              Submit Reply
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                setShowReplyCreateForm(false);
                setReplyContent(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {replyContent && !isReported && (
        <HotelReply
          isHotelManager={isHotelManager}
          text={replyContent}
          parentId={review._id}
          parentHandleDeleteReply={handleDeleteReply}
        />
      )}
      <AlertConfirmation
        onOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        type='edit'
        onConfirm={handleSaveEdit}
      />
      <AlertConfirmation
        onOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type='delete'
        onConfirm={handleDelete}
      />
      <AlertConfirmation
        onOpen={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        type='create'
        onConfirm={handleReplySubmit}
      />
      <AlertConfirmation
        onOpen={isIgnoreDialogOpen}
        type='edit'
        onOpenChange={setIsIgnoreDialogOpen}
        onConfirm={handleIgnore}
      />
    </div>
  );
}
