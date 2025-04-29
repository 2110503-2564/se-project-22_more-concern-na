'use client'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRedeemInventory } from '@/lib/redeemableService';  
import { useSession } from 'next-auth/react';
import AlertConfirmation from './AlertConfirmation';
import { toast } from 'sonner';

interface CouponCardProps {
  id: string;
  name: string;
  point: number;
  discount: number;
  expire: string;
  remain: number;
  type: 'view' | 'redeem';
  token?: string;
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
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const token = (session as any)?.user?.token;
  const userPoints = (session as any)?.user?.data?.point || 0;
  
  // Set type to 'view' if user is not logged in
  const effectiveType = status === 'unauthenticated' ? 'view' : type;

  const handleRedeemButtonClick = () => {
    // Check if user has enough points before showing dialog
    if (userPoints < point) {
      toast.error('Insufficient points to redeem this coupon');
      return;
    }
    
    // Only show dialog if user has sufficient points
    setShowDialog(true);
  };

  const handleRedeem = async () => {
    setIsRedeeming(true);
    setError(null);
    
    try {
      // Call API to redeem using the service
      const res = await createRedeemInventory(token, id);
      if (res) {
        toast.success('Redemption Successful');
        router.push('/profile/inventory');
      } else {
        toast.error('Failed to redeem coupon');
      }
      
      // Hide confirmation dialog
      setShowDialog(false);
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      setError(error instanceof Error ? error.message : 'Failed to redeem coupon');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
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

            {effectiveType === 'redeem' && (
              <Button
                variant='default'
                className='bg-bg-btn text-white text-sm font-heading px-4 py-1 rounded hover:bg-blue-700'
                data-testid='redeem-button'
                onClick={handleRedeemButtonClick}
                disabled={isRedeeming}
              >
                {isRedeeming ? 'Redeeming...' : 'Redeem'}
              </Button>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
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
}