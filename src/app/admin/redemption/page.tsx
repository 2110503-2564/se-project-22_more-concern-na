'use client';

import PageNavigator from '@/components/PageNavigator';
import { Button } from '@/components/ui/button';
import UserPointEntry from '@/components/UserPointEntry';
import { getUserPoints, updateUserPoints } from '@/lib/pointService';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UsersPointsResponse } from '../../../../interface';

export default function AdminRedemptionPage() {
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState<UsersPointsResponse | undefined>(
    undefined,
  );

  const fetchData = async () => {
    setUserData(undefined);
    const response = await getUserPoints(page, 5, token);
    setUserData(response);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSavePoint = async (newPoint: number, id: string) => {
    console.log(newPoint, id);
    const response = await updateUserPoints(id, newPoint, token);
    if (response) {
      fetchData();
      toast.success('Points adjusted successfully');
    } else {
      toast.error('Failed to update user points');
    }
  };
  const handleChangePage = (action: 'next' | 'prev') => {
    if (action === 'next' && userData?.pagination.next)
      return () => setPage((prev) => prev + 1);
    if (action === 'prev' && userData?.pagination.prev)
      return () => setPage((prev) => prev - 1);
    return undefined;
  };

  return (
    <div className='p-4'>
      <Link
        href='/admin'
        className='font-detail text-white underline hover:text-gray-400'
      >
        Back To Admin Dashboard
      </Link>
      <section className='py-4'>
        <h1
          className='text-white font-heading text-3xl'
          data-testid='price-to-point-rate'
        >
          Price To Point Rate
        </h1>
        <div className='flex gap-4 justify-around bg-bg-box p-4 m-4 items-center'>
          <p
            className='text-white font-detail'
            data-testid='booking-price-per-point'
          >
            Booking Price per Point
          </p>
          <input
            className='bg-bg-textfill rounded-md placeholder:text-bg-placeholder p-2 text-white'
            placeholder='Enter rate'
          ></input>
          <Button variant='golden' data-testid='save-rate-btn'>
            Save
          </Button>
        </div>
      </section>
      <section>
        <h1
          className='text-white font-heading text-3xl'
          data-testid='manage-redeem-points'
        >
          Manage Redeem Points
        </h1>
        <div className='flex flex-col items-center py-4'>
          <div className='flex flex-col gap-2 w-fit'>
            {userData?.data.map((data) => {
              return (
                <UserPointEntry
                  key={data._id}
                  id={data._id}
                  email={data.email}
                  name={data.name}
                  point={data.point}
                  handleSave={handleSavePoint}
                />
              );
            })}
          </div>
        </div>
        <PageNavigator
          page={page}
          onNext={handleChangePage('next')}
          onPrev={handleChangePage('prev')}
        />
      </section>
    </div>
  );
}
