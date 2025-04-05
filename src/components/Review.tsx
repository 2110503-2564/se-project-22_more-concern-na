import { Rating } from '@mui/material';
import dayjs from 'dayjs';
import { Reply } from 'lucide-react';
import HotelReply, { HotelReplyType } from './HotelReply';
import ReviewDropDown from './ReviewDropDown';
import { Button } from './ui/button';

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
}

export default function Review({ review }: ReviewProps) {
  return (
    <div>
      <div className='relative border border-gray-200 bg-[#434A5B] text-white rounded-sm px-6 pt-6 mb-4 shadow'>
        <div className='absolute top-2 right-6'>
          <ReviewDropDown />
        </div>
        <div className='flex items-center'>
          <img
            src={review.avatarUrl || '/default-avatar.png'}
            alt={`${review.username}'s avatar`}
            className='w-[50px] h-[50px] rounded-full mr-3'
          />
          <div>
            <h3 className='text-lg font-semibold'>{review.username}</h3>
            <p className='text-sm text-gray-400'>
              Stayed {dayjs(review.date).format('MMMM YYYY')}
            </p>
          </div>
        </div>
        <div className='mt-2 flex flex-row'>
          <h4 className='text-xl font-medium mr-3'>{review.title}</h4>
          <Rating
            value={review.rating}
            readOnly
            precision={1}
            size='small'
            className='mt-1.5'
          />
        </div>
        <p className='mt-2 text-base'>"{review.comment}"</p>
        <div className='flex justify-end mt-4'>
          <Button variant='link' className='text-white'>
            <Reply /> reply
          </Button>
        </div>
      </div>
      {review.reply && <HotelReply reply={review.reply} />}
    </div>
  );
}
