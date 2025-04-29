'use client';

import { getInventoryCoupons } from '@/lib/inventoryService';
import { TicketPercent } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { InventoryCouponsData } from '../../interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface CouponDropDownProps {
  onSelect: (coupon: InventoryCouponsData) => void;
}

export default function CouponDropDown({ onSelect }: CouponDropDownProps) {
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  const [coupons, setCoupons] = useState<InventoryCouponsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      signIn();
      return;
    }

    async function fetchCoupons() {
      try {
        const couponsResponse = await getInventoryCoupons(1, 50, token);
        setCoupons(couponsResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [session, token]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TicketPercent />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : (
          <>
            {coupons.length > 0 ? (
              <>
                {coupons.map((coupon) => (
                  <DropdownMenuItem
                    key={`coupon-${coupon.id}`}
                    className='cursor-pointer'
                    onClick={() => onSelect(coupon)}
                  >
                    {coupon.name} - {coupon.discount * 100}%
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <DropdownMenuItem disabled>No coupons available</DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
