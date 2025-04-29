'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { TicketPercent } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getInventoryCoupons } from '@/lib/inventoryService';
import { InventoryCouponsData } from '../../interface';

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
      <DropdownMenuContent className="w-56" align="start">
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : (
          <>
            {coupons.length > 0 ? (
              <>
                {coupons.map((coupon) => (
                  <DropdownMenuItem
                    key={`coupon-${coupon._id}`}
                    className="cursor-pointer"
                    onClick={() => onSelect(coupon)}
                  >
                    {coupon.name} - {coupon.discount}฿
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