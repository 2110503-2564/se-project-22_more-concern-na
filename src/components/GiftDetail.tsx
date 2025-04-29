'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
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

interface GiftDetailProps {
  id: string;
  name: string;
  description?: string;
  point: number;
  picture?: string;
  remain?: number;
  type: 'view' | 'redeem';
  token?: string;
}

export default function GiftDetail({
  id,
  name,
  description,
  point,
  picture,
  remain,
  type,
}: GiftDetailProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  const handleRedeem = async () => {
    
    setIsRedeeming(true);
    setError(null);
    
    try {
      // Call API to redeem using the service
      await createRedeemInventory(token, id);
      
      // Show success dialog
      setShowDialog(true);
    } catch (error) {
      console.error('Error redeeming gift:', error);
      setError(error instanceof Error ? error.message : 'Failed to redeem gift');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className='w-full'>
      {/* Heading outside the box */}
      <h2 className='text-6xl font-bold font-heading mb-9 ml-6 text-white'>Gift Detail</h2>

      {/* Gift box */}
      <div className='bg-[#0F172A] text-white p-6 border border-gray-700'>
        <div className='flex flex-col md:flex-row items-center gap-6 p-10'>
          
          {/* Picture & Point Section */}
          <div className="relative flex-shrink-0 w-64 h-64">
            <div className="bg-gray-300 rounded-md overflow-hidden w-full h-full">
              {picture ? (
                <img 
                  src={picture} 
                  alt={name} 
                  className="w-full h-full object-cover max-w-full max-h-full" 
                  style={{ objectPosition: 'center' }}
                />
              ) : (
                <img 
                  src={"/defaultHotel.png"} 
                  alt={name} 
                  className="w-full h-full object-cover max-w-full max-h-full" 
                  style={{ objectPosition: 'center' }}
                />
              )}
            </div>
            <div className="flex absolute bottom-0 w-full h-10 bg-gradient-to-r from-gold-gd1 to-gold-gd2 text-black text-2xl font-light items-center justify-center font-detail py-1 rounded-b-md">
              {point} Points
            </div>
          </div>

          {/* Info Section */}
          <div className='flex-1 text-left ml-20'>
            <div
              className='text-5xl font-heading font-semibold text-gold-gd1 mb-6'
              data-testid='name'
            >
              {name}
              {type === 'redeem' && remain !== undefined ? (
                <span
                  className='text-2xl text-gray-300 font-heading ml-4'
                  data-testid='remain'
                >
                  • {remain} Remaining
                </span>
              ) : null}
            </div>
            <p
              className='break-all mt-2 text-gray-200 text-xl font-detail leading-relaxed ml-4'
              data-testid='description'
            >
              {description}
            </p>

            {/* Redeem Button positioned to the right */}
            {type === 'redeem' && point > 0 ? (
              <div className='flex flex-col items-end mt-10'>
                <Button 
                  className='w-50 h-14 text-2xl mr-26 cursor-pointer' 
                  variant='golden'
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </Button>
                {error && (
                  <div className="text-red-500 text-xl mt-2 mr-26">{error}</div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redemption Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully redeemed {name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}