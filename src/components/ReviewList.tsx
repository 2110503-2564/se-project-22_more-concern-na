'use client';

import { getHotelReviews } from '@/lib/hotelService';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ReviewResponseSection } from '../../interface';
import Review from './Review';

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
            }
          }; 
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getHotelReviews(
        hotelId ?? '',
        {
          selfPage: isSelf ? page : 0,
          selfPageSize: isSelf ? 5 : 0,
          otherPage: isSelf ? 0 : page,
          otherPageSize: isSelf ? 0 : 5,
        },
        (session as any)?.user?.token,
      );
      setReviewData(isSelf ? res.self : res.other);
    };
    fetchReviews();
  }, [page]);

  return (
    <section>
      <h2>{title}</h2>
      {reviewData && reviewData.data.length > 0 ? (
        reviewData.data.map((review) => (
          <Review key={review._id} review={review} handleDeleteFromList={handleDeleteFromList}/>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </section>
  );
}
