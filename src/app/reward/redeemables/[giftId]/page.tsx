'use client';

import GiftDetail from '@/components/GiftDetail';
import { getGiftById } from '@/lib/redeemableService';
import { useEffect, useState } from 'react';
import { RedeemableGiftResponse } from '../../../../../interface';

export default function GiftDetailPage({
  params,
}: {
  params: { giftId: string };
}) {
  const [giftData, setGiftData] = useState<RedeemableGiftResponse | undefined>(
    undefined,
  );
  useEffect(() => {
    const fetchData = async () => {
      setGiftData(undefined);
      const response = await getGiftById(params.giftId);
      setGiftData(response);
    };
    fetchData();
  }, [params.giftId]);
  return (
    <>
      {giftData ? (
        <div className='flex justify-center items-center h-screen px-4'>
          <GiftDetail
            id={giftData._id}
            name={giftData.name}
            description={giftData.description}
            point={giftData.point}
            picture={giftData.picture}
            remain={giftData.remain}
            type='redeem'
          />
        </div>
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      )}
    </>
  );
}
