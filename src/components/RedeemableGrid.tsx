'use client';

import { getAllCoupons, getAllGifts } from '@/lib/redeemableService';
import { useEffect, useState } from 'react';
import { RedeemableCouponsData, RedeemableGiftsData } from '../../interface';
import CouponCard from './CouponCard';
import { GiftCard } from './GiftCard';
import Loader from './Loader';
import PageNavigator from './PageNavigator';

interface RedeemablesGridProps {
  children: React.ReactNode;
  rowCount: number;
  cardType: 'coupon' | 'gift';
  cardView: 'view' | 'redeem';
  disablePage?: boolean;
}

export default function RedeemableGrid({
  children,
  rowCount,
  cardType,
  cardView,
  disablePage
}: RedeemablesGridProps) {
  const [cardData, setCardData] = useState<
    RedeemableCouponsData[] | RedeemableGiftsData[] | undefined
  >(undefined);
  const [pagination, setPagination] = useState<
    | {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
      }
    | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  //   function calculatePageSize() {
  //     const width = window.innerWidth;
  //     let itemsPerRow;

  //     if (width < 640) itemsPerRow = 1;
  //     else if (width < 1024) itemsPerRow = 2;
  //     else if (width < 1440) itemsPerRow = 3;
  //     else itemsPerRow = 4;

  //     return itemsPerRow * rowCount;
  //   }

  //   useEffect(() => {
  //     const handleResize = () => {
  //       setPageSize(calculatePageSize());
  //     };

  //     handleResize();
  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  //   }, [rowCount]);

  useEffect(() => {
    const fetchData = async () => {
      setCardData(undefined);
      const response =
        cardType === 'coupon'
          ? await getAllCoupons(page, pageSize)
          : await getAllGifts(page, pageSize);
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          {cardData ? (
            cardData.length > 0 &&
            cardData.map((item) => {
              return (
                <div key={item.id} className='flex justify-center'>
                  {cardType === 'coupon' ? (
                    <CouponCard
                      id={item.id}
                      name={item.name}
                      point={item.point}
                      discount={(item as RedeemableCouponsData).discount}
                      expire={(item as RedeemableCouponsData).expire}
                      remain={item.remain}
                      type={cardView}
                    />
                  ) : (
                    <GiftCard
                      id={item.id}
                      name={item.name}
                      point={item.point}
                      picture={(item as RedeemableGiftsData).picture}
                      remain={item.remain}
                      type={cardView}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className='flex items-center justify-center w-full min-h-[200px]'>
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
