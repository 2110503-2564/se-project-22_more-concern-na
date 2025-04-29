'use client';
import RedeemableGrid from '@/components/RedeemableGrid';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { getInventoryCoupons, getInventoryGifts } from '@/lib/inventoryService';
import { Gift, Ticket } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function inventory() {
  const router = useRouter();
  const [couponCount, setCouponCount] = useState<number>(0);
  const [giftCount, setGiftCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const rawCouponData = await getInventoryCoupons(
        1,
        1,
        (session as any)?.user?.token,
      );
      const rawGiftData = await getInventoryGifts(
        1,
        1,
        (session as any)?.user?.token,
      );
      setCouponCount(rawCouponData.total);
      setGiftCount(rawGiftData.total);
    };
    fetchData();
  }, []);

  const handleClick = () => {
    router.push('/reward/redeemables');
  };

  return (
    <div className='container mx-auto p-4'>
      <div>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-white text-3xl font-heading'>Your Inventory</h1>
          <Button
            variant='golden'
            onClick={handleClick}
            className='rounded-sm flex items-center justify-center font-detail'
            data-testid='redeemMore'
          >
            Redeem more
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <StatCard
            icon={<Ticket size={28} className='text-white' />}
            title='Coupon'
            count={couponCount}
            countLabel='Total available coupons'
            hideButton={true}
          />

          <StatCard
            icon={<Gift size={28} className='text-white' />}
            title='Gift'
            count={giftCount}
            countLabel='Total gift that you redeemed'
            hideButton={true}
          />
        </div>
        <RedeemableGrid cardType='coupon' cardView='inventory' pageSize={4}>
            <h2 className='text-white font-heading text-2xl'>Coupons</h2>
        </RedeemableGrid>
        <RedeemableGrid cardType='gift' cardView='inventory' pageSize={4}>
            <h2 className='text-white font-heading text-2xl'>Gifts</h2>
        </RedeemableGrid>
      </div>
    </div>
  );
}
