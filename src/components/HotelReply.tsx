import ReplyDropDown from './ReplyDropDown';

export interface HotelReplyType {
  id: number;
  hotelName: string;
  avatarUrl?: string;
  date: string;
  comment: string;
}

interface HotelReplyProps {
  reply: HotelReplyType;
}

export default function HotelReply({ reply }: HotelReplyProps) {
  return (
    <div className='relative ml-12 border-l-4 border-yellow-500 bg-[#303646] rounded-sm px-4 pt-3 pb-6 mt-4 mb-8'>
      <div className='absolute text-white top-2 right-6'>
        <ReplyDropDown />
      </div>
      <div className='flex items-center'>
        <p className='text-xl text-[#FFD400] mb-3'>{reply.hotelName}</p>
      </div>
      <p className='font-normal text-sm text-[#d7d7d7]'>{reply.comment}</p>
    </div>
  );
}
