import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { addGift } from '@/lib/redeemableService';

export default function GiftCreationForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [giftData, setGiftData] = useState({
    name: '',
    description: '',
    point: 0,
    remain: 1,
    picture: '',
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGiftData({
      ...giftData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    onClose();
    const response = await addGift(giftData, (session as any)?.user?.token);
    if (response.success) {
      toast.success('Gift created successfully');
    } else {
      toast.error('Failed to create gift');
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
          Add New Redeemable
        </h2>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-300'
            >
              Gift Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={giftData.name}
              onChange={handleInputChange}
              placeholder='Add Gift Name'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-300'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={giftData.description}
              onChange={handleInputChange}
              placeholder='Add a description'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='picture'
              className='block text-sm font-medium text-gray-300'
            >
              Picture URL (optional)
            </label>
            <input
              type='text'
              id='picture'
              name='picture'
              value={giftData.picture}
              onChange={handleInputChange}
              placeholder='Enter image URL'
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='point'
              className='block text-sm font-medium text-gray-300'
            >
              Point Cost
            </label>
            <input
              type='number'
              id='point'
              name='point'
              value={giftData.point}
              onChange={handleInputChange}
              min={0}
              placeholder='Required points'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='remain'
              className='block text-sm font-medium text-gray-300'
            >
              Available Count
            </label>
            <input
              type='number'
              id='remain'
              name='remain'
              value={giftData.remain}
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
          disabled={!giftData.name || !giftData.description || !giftData.point || !giftData.remain || giftData.name === '' || giftData.point < 0 || giftData.remain < 1 || giftData.description === ''}
        >
          Create Gift
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