import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { addCoupon } from '@/lib/redeemableService';

export default function CouponCreationForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [couponData, setCouponData] = useState({
    name: '',
    point: 0,
    discount: 1,
    expire: '',
    remain: 1,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCouponData({
      ...couponData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    onClose();
    const response = await addCoupon(couponData, (session as any)?.user?.token);
    if (response.success) {
      toast.success('Coupon created successfully');
    } else {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4'>
      <dialog className='w-full max-w-md bg-bg-box border border-bg-border rounded-lg shadow-lg p-6 space-y-4 relative fade-in-50 animate-in' open={true}>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white'
          aria-label='Close'
        >
          <X size={20} />
        </button>

        <h2 className='text-2xl font-semibold text-center text-white mb-4 font-heading'>
          Add New Coupon
        </h2>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-300'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={couponData.name}
              onChange={handleInputChange}
              placeholder='Add Coupon Name'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='point'
              className='block text-sm font-medium text-gray-300'
            >
              Point
            </label>
            <input
              type='number'
              id='point'
              name='point'
              value={couponData.point}
              onChange={handleInputChange}
              min={0}
              placeholder='Required points'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='discount'
              className='block text-sm font-medium text-gray-300'
            >
              Discount
            </label>
            <input
              type='number'
              id='discount'
              name='discount'
              value={couponData.discount}
              onChange={handleInputChange}
              placeholder='Discount amount'
              min={1}
              max={100}
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='expire'
              className='block text-sm font-medium text-gray-300'
            >
              Expire
            </label>
            <input
              type='date'
              id='expire'
              name='expire'
              value={couponData.expire}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='remain'
              className='block text-sm font-medium text-gray-300'
            >
              Remain
            </label>
            <input
              type='number'
              id='remain'
              name='remain'
              value={couponData.remain}
              onChange={handleInputChange}
              placeholder='Available quantity'
              min={1}
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>
        </div>

        <Button
          type='button'
          variant='golden'
          className='w-full'
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={!couponData.name || !couponData.point || !couponData.discount || !couponData.expire || !couponData.remain || couponData.name === '' || couponData.expire === ''}
        >
          Create Coupon
        </Button>

        {error && <p className='text-red-600 text-center mt-2'>{error}</p>}
      </dialog>

      <AlertConfirmation
        type='create'
        onOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onConfirm={handleSubmit}
        onCancel={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
