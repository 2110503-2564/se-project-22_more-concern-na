'use client';

import RedeemableGrid from '@/components/RedeemableGrid';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';

export default function RedeemablesPage() {
  const { data: session } = useSession();
  const isAdmin = session ? (session.user as any)?.data.role === 'admin' : false;
  return (
    <div>
      <RedeemableGrid cardType='coupon' cardView='redeem' pageSize={6}>
        <div className='flex justify-between p-4'>
          <h1 className='text-center font-heading font-semibold text-white text-4xl'>
            Coupons
          </h1>
          {isAdmin && <Button variant='golden'>Add Coupon</Button>}
        </div>
      </RedeemableGrid>

      <Separator className='my-4' />
      <RedeemableGrid cardType='gift' cardView='redeem' pageSize={6}>
        <div className='flex justify-between p-4'>
          <h1 className='text-center font-heading font-semibold text-white text-4xl'>
            Gifts
          </h1>
          {isAdmin && <Button variant='golden'>Add Gift</Button>}
        </div>
      </RedeemableGrid>
    </div>
  );
}
