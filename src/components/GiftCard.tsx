'use client';
import { BadgeInfo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { createRedeemInventory } from '@/lib/redeemableService'; 
import { useSession } from 'next-auth/react';
import AlertConfirmation from './AlertConfirmation';
import { toast } from 'sonner';

interface GiftCardProps {
  id: string;
  name: string;
  point: number;
  description?: string;
  picture?: string;
  remain: number;
  type: 'view' | 'redeem' | 'inventory';
  token?: string;
}

export const GiftCard = ({
  id,
  name,
  point,
  description,
  picture,
  remain,
  type,
}: GiftCardProps) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const token = (session as any)?.user?.token;
  const userPoints = (session as any)?.user?.data?.point || 0;
  
  // Set type to 'view' if user is not logged in
  const effectiveType = status === 'unauthenticated' ? 'view' : type;

  const handleClick = () => {
    effectiveType === 'inventory'
      ? router.push(`/profile/inventory/${id}`)
      : router.push(`/reward/redeemables/${id}`);
  };

  const handleRedeemButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user has enough points before showing dialog
    if (userPoints < point) {
      toast.error('Insufficient points to redeem this gift');
      return;
    }
    
    // Only show dialog if user has sufficient points
    setShowDialog(true);
  };

  const handleRedeem = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setIsRedeeming(true);
    setError(null);
    
    try {
      // Call API to redeem using the service
      const res = await createRedeemInventory(token, id);
      if (res) {
        toast.success('Redemption Successful');
        router.push('/profile/inventory');
      } else {
        toast.error('Failed to redeem gift');
      }
      
      // Hide confirmation dialog
      setShowDialog(false);
    } catch (error) {
      console.error('Error redeeming gift:', error);
      setError(error instanceof Error ? error.message : 'Failed to redeem gift');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <div
        className='flex flex-col w-full max-w-xs rounded-xl overflow-hidden shadow-lg'
        onClick={handleClick}
        data-testid={name}
      >
        {/* Top section with points and badge */}
        <div className='relative h-48'>
          {/* Background image */}
          {picture ? (
            <img
              src={picture}
              alt={name}
              className='absolute inset-0 w-full h-full object-cover'
              data-testid='picture'
            />
          ) : (
            <div
              className='absolute inset-0 w-full h-full bg-base-gd'
              data-testid='picture-skeleton'
            />
          )}

          {/* Content overlay */}
          <div className='absolute inset-0 p-4 flex items-start justify-between'>
            {/* Badge/Logo */}
            <div className='bg-gray-800 rounded-full p-2'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <BadgeInfo className='text-white' />
              </div>
            </div>

            {/* Points display */}
            <div className='text-right'>
              <span
                className='font-number text-white text-lg bg-bg-box/70 px-2 py-1 rounded-md'
                data-testid='point'
              >
                {point} Points
              </span>
            </div>
          </div>
        </div>

        {/* Bottom section with details */}
        <div className='bg-gradient-to-b from-gold-gd1 to-gold-gd2 p-4 flex flex-col'>
          {/* Remaining counter */}
          <div className='text-right mb-2'>
            <span
              className='font-number text-cardfont-cl text-lg'
              data-testid='remain'
            >
              {remain} Remaining
            </span>
          </div>

          {/* Gift name */}
          <h3 className='font-heading text-cardfont-cl text-3xl mb-2'>{name}</h3>

          {/* Action button - only show when type is 'redeem' and user is logged in */}
          {effectiveType === 'redeem' && (
            <>
              <Button
                className='w-full bg-bg-btn hover:bg-bg-btn-hover text-white py-2 rounded'
                onClick={handleRedeemButtonClick}
                disabled={isRedeeming}
                data-testid='redeem-button'
              >
                {isRedeeming ? 'Redeeming...' : 'Redeem'}
              </Button>
              {error && (
                <div className="text-red-600 text-sm mt-2">{error}</div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertConfirmation
        onOpen={showDialog}
        onOpenChange={setShowDialog}
        type='redeem'
        onConfirm={handleRedeem}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
};