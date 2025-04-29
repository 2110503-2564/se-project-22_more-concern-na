'use client';

import { getAllCoupons, getAllGifts } from '@/lib/redeemableService';
import { useEffect, useState } from 'react';
import { InventoryCouponsData, InventoryData, InventoryGiftsData, RedeemableCouponsData, RedeemableGiftsData, RedeemablesData } from '../../interface';
import CouponCard from './CouponCard';
import { GiftCard } from './GiftCard';
import Loader from './Loader';
import PageNavigator from './PageNavigator';
import { getInventoryCoupons, getInventoryGifts } from '@/lib/inventoryService';
import { useSession } from 'next-auth/react';

interface RedeemablesGridProps {
  children: React.ReactNode;
  pageSize: number;
  cardType: 'coupon' | 'gift';
  cardView: 'view' | 'redeem' | 'inventory';
  disablePage?: boolean;
}

export default function RedeemableGrid({
  children,
  pageSize,
  cardType,
  cardView,
  disablePage
}: RedeemablesGridProps) {
  const [cardData, setCardData] = useState<
    RedeemablesData[] | InventoryData[] | undefined
  >(undefined);
  const [pagination, setPagination] = useState<
    | {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
      }
    | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const {data: session} = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setCardData(undefined);
      const response =
        cardType === 'coupon'
          ? (cardView === 'inventory' ? await getInventoryCoupons(page, pageSize, (session as any)?.user?.token) : await getAllCoupons(page, pageSize))
          : (cardView === 'inventory' ? await getInventoryGifts(page, pageSize, (session as any)?.user?.token) : await getAllGifts(page, pageSize));
      setCardData(response.data);
      setPagination(response.pagination);
    };
    fetchData();
  }, [page]);

  const handleChangePage = (action: 'next' | 'prev') => {
    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => prev - 1);
    if (action === 'next') {
      return pagination?.next ? nextPage : undefined;
    } else if (action === 'prev') {
      return pagination?.prev ? prevPage : undefined;
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {children}
      <div className='flex flex-col gap-4 items-center w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {cardData ? (
            cardData.length > 0 &&
            cardData.map((item) => {
              return (
                <div key={(item as RedeemablesData)._id || (item as InventoryData).id} className='h-full w-full'>
                  <div className='h-full flex'>
                    {cardType === 'coupon' ? (
                      <CouponCard
                        id={(item as RedeemablesData)._id || (item as InventoryData).id}
                        name={item.name}
                        point={(item as RedeemablesData).point}
                        discount={(item as RedeemableCouponsData).discount}
                        expire={(item as RedeemableCouponsData).expire}
                        remain={(item as RedeemablesData).remain}
                        type={cardView === 'inventory' ? 'view' : cardView}
                      />
                    ) : (
                      <GiftCard
                        id={(item as RedeemablesData)._id || (item as InventoryData).id}
                        name={item.name}
                        point={(item as RedeemablesData).point}
                        picture={(item as RedeemableGiftsData).picture}
                        remain={(item as RedeemablesData).remain}
                        type={cardView}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className='flex items-center justify-center w-full min-h-[200px] col-span-full'>
              <Loader />
            </div>
          )}
        </div>
        {!disablePage && <PageNavigator
          page={page}
          onNext={handleChangePage('next')}
          onPrev={handleChangePage('prev')}
        />}
      </div>
    </div>
  );
}
