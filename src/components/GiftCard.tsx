'use client';
import { BadgeInfo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GiftCardProps {
  id: string;
  name: string;
  point: number;
  description?: string;
  picture?: string;
  remain: number;
  type: 'view' | 'redeem' | 'inventory';
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

  const handleClick = () => {
    type === 'inventory'
      ? router.push(`/profile/inventory/${id}`)
      : router.push(`/reward/redeemables/${id}`);
  };

  const handleRedeem = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle redeem logic here
    // Then show the dialog
    setShowDialog(true);
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

          {/* Action button - only show when type is 'redeem' */}
          {type === 'redeem' && (
            <Button
              className='w-full bg-bg-btn hover:bg-bg-btn-hover text-white py-2 rounded'
              onClick={handleRedeem}
              data-testid='redeem-button'
            >
              Redeem
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redemption Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully redeemed the {name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};