import dayjs, { Dayjs } from 'dayjs';
import { Button } from './ui/button';

interface CouponCardProps {
  id: string;
  name: string;
  point: number;
  discount: number;
  expire: string;
  remain: number;
  type: 'view' | 'redeem';
}

export default function CouponCard({
  id,
  name,
  point,
  discount,
  expire,
  remain,
  type,
}: CouponCardProps) {
  return (
    <div className='flex w-full max-w-md rounded-lg overflow-hidden shadow-md bg-gray-900 text-black' data-testid={`coupon-${Math.round(discount * 100)}%-${dayjs(expire).format('MM-DD-YYYY')}`}>
      <div className='flex items-center justify-center bg-gradient-to-r from-gold-gd1 to-gold-gd2 w-1/3 p-4'>
        <div className='text-center'>
          <div
            className='text-4xl font-bold font-heading'
            data-testid='discount'
          >
            {Math.round(discount * 100)}%
          </div>
          <div className='text-sm mt-2 font-heading' data-testid='point'>
            {point} Points
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between bg-gray-200 text-black w-2/3 p-4'>
        <div>
          <div
            className='text-lg font-detail font-semibold mb-2'
            data-testid='name'
          >
            {name}
          </div>
          <div className='text-sm font-detail' data-testid='expire'>
             Expires {dayjs(expire).format('MM-DD-YYYY')}
          </div>
        </div>
        <div className='flex items-center justify-between mt-4'>
          <div className='text-sm font-detail' data-testid='remain'>
            {remain} Remaining
          </div>

          {type === 'redeem' && (
            <Button
              variant='default'
              className='bg-bg-btn text-white text-sm font-heading px-4 py-1 rounded hover:bg-blue-700'
              data-testid='redeem-button'
            >
              Redeem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
