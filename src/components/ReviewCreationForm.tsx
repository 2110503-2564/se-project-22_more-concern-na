import { addReview } from '@/lib/reviewService';
import { Rating } from '@mui/material';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AlertConfirmation from './AlertConfirmation';
import { Button } from './ui/button';

export default function ReviewCreationForm({
  bookingId,
  onClose,
}: {
  bookingId: string;
  onClose: () => void;
}) {
  const [reviewData, setReviewData] = useState({
    title: '',
    text: '',
    rating: 0,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >,
  ) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    onClose();
    const response = await addReview(
      bookingId,
      reviewData,
      (session as any)?.user?.token,
    );
    if (!response) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4'>
      <div className='w-full max-w-md bg-bg-box border border-bg-border rounded-lg shadow-lg p-6 space-y-4 relative fade-in-50 animate-in'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white'
          aria-label='Close'
        >
          <X size={20} />
        </button>

        <h2 className='text-2xl font-semibold text-center text-white mb-4 font-heading'>
          Write a Review
        </h2>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-300'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={reviewData.title}
              onChange={handleInputChange}
              placeholder='Give your review a title'
              required
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='text'
              className='block text-sm font-medium text-gray-300'
            >
              Your Review
            </label>
            <textarea
              id='text'
              name='text'
              value={reviewData.text}
              onChange={handleInputChange}
              placeholder='Share your experience'
              rows={4}
              className='w-full px-3 py-2 bg-gray-800 border border-bg-border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-300'>
              Rating
            </label>
            <div className='flex justify-center py-2'>
              <Rating
                name='rating'
                value={reviewData.rating}
                onChange={(_, newValue) => {
                  setReviewData({ ...reviewData, rating: newValue || 0 });
                }}
                precision={1}
                size='large'
                sx={{ color: '#f59e0b', border: '#ffffff' }}
              />
            </div>
          </div>

          <Button
            type='button'
            variant='golden'
            className='w-full'
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Submit Review
          </Button>

          {error && <p className='text-red-600 text-center mt-2'>{error}</p>}
        </div>

        <AlertConfirmation
          type='create'
          onOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onConfirm={handleSubmit}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </div>
    </div>
  );
}
