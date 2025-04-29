'use client'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createRedeemInventory } from '@/lib/redeemableService';  
import { useSession } from 'next-auth/react';

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
  const [showDialog, setShowDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  const handleRedeem = async () => {
    console.log(token);
    
    
    setIsRedeeming(true);
    setError(null);
    
    try {
      // Call API to redeem using the service
      await createRedeemInventory(token, id);
      
      // Show success dialog
      setShowDialog(true);
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

            {type === 'redeem' && (
              <Button
                variant='default'
                className='bg-bg-btn text-white text-sm font-heading px-4 py-1 rounded hover:bg-blue-700'
                data-testid='redeem-button'
                onClick={handleRedeem}
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

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redemption Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully redeemed the {Math.round(discount * 100)}% discount coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}