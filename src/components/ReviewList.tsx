'use client';

import { getHotelReviews } from '@/lib/hotelService';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ReviewResponseSection } from '../../interface';
import Review from './Review';
import { Button } from './ui/button';
import Loader from './Loader';

export default function ReviewList({
  title,
  hotelId,
  isSelf,
}: {
  title: string;
  hotelId?: string;
  isSelf?: boolean;
}) {
  const [reviewData, setReviewData] = useState<ReviewResponseSection | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteFromList = (reviewId: string) => {
    if (reviewData) {
      setReviewData((prev) => {
        if (prev) {
          const updatedData = prev.data.filter(
            (review) => review._id !== reviewId,
          );
          return {
            data: updatedData,
            pagination: {
              count: updatedData.length,
              prev: updatedData.length > 0 ? page - 1 : undefined,
              next: updatedData.length > 0 ? page + 1 : undefined,
            },
          };
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const res = await getHotelReviews(
        hotelId ?? '',
        {
          selfPage: isSelf ? page : 0,
          selfPageSize: isSelf ? 3 : 0,
          otherPage: isSelf ? 0 : page,
          otherPageSize: isSelf ? 0 : 3,
        },
        (session as any)?.user?.token,
      );
      setReviewData(isSelf ? res.self : res.other);
      setIsLoading(false);
    };
    fetchReviews();
  }, [page, hotelId, isSelf, session]);

  const handlePrevPage = () => {
    if (reviewData?.pagination.prev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (reviewData?.pagination.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <section>
      <h2>{title}</h2>
      {reviewData && reviewData.data.length > 0 ? (
        <>
          {reviewData.data.map((review) => (
            <Review
              key={review._id}
              review={review}
              handleDeleteFromList={handleDeleteFromList}
            />
          ))}
          <div className='flex justify-center gap-4 mt-4'>
            <Button
              onClick={handlePrevPage}
              disabled={!reviewData.pagination.prev}
              variant='golden'
              size='sm'
            >
              Previous
            </Button>
            <span className='self-center font-detail'>Page {page}</span>
            <Button
              onClick={handleNextPage}
              disabled={!reviewData.pagination.next}
              variant='golden'
              size='sm'
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p>No reviews available.</p>
      )}
    </section>
  );
}
