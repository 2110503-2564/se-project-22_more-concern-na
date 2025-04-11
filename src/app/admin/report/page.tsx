'use client';

import Review, { ReviewType } from '@/components/Review';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const reportedReasons: {
  reason: string;
  hotels: {
    name: string;
    reviews: ReviewType[];
  }[];
}[] = [
  {
    reason: 'Inappropriate Language',
    hotels: [
      {
        name: 'Hotel Alpha',
        reviews: [
          {
            id: 1,
            username: 'Username',
            date: '2024-06-01',
            rating: 1,
            title: 'Awful experience',
            comment: 'review text.',
          },
          {
            id: 2,
            username: 'Username',
            date: '2024-06-02',
            rating: 1,
            title: 'Very bad',
            comment: 'review text.',
          },
        ],
      },
      {
        name: 'Hotel Beta',
        reviews: [
          {
            id: 3,
            username: 'Username',
            date: '2024-06-03',
            rating: 1,
            title: 'Dirty',
            comment: 'review text.',
          },
          {
            id: 4,
            username: 'Username',
            date: '2024-06-04',
            rating: 1,
            title: 'Loud & noisy',
            comment: 'review text.',
          },
        ],
      },
    ],
  },
  {
    reason: 'Spam Review',
    hotels: [
      {
        name: 'Hotel Gamma',
        reviews: [
          {
            id: 5,
            username: 'Username',
            date: '2024-06-05',
            rating: 5,
            title: 'Perfect!',
            comment: 'review text.',
          },
        ],
      },
    ],
  },
];

export default function ManageReportedReviewsPage() {
  return (
    <div className='bg-bg-box min-h-screen px-6 py-8 text-[--color-foreground]'>
      <Link
        href='/admin'
        className='text-sm font-detail text-muted-foreground hover:underline'
      >
        ← Back to Admin Dashboard
      </Link>

      <h1 className='text-5xl font-heading mt-4 mb-2 text-white'>
        Manage Reported Reviews
      </h1>
      <p className='text-base font-detail text-muted-foreground mb-8'>
        Manage reported reviews listings
      </p>

      {reportedReasons.map((reasonBlock, i) => (
        <div key={i} className='mb-12 space-y-6'>
          <h2 className='text-4xl font-heading mb-2 text-white'>
            Report Reason
          </h2>

          {reasonBlock.hotels.map((hotel, j) => (
            <div key={j} className='bg-base-gd rounded-md p-4 space-y-4'>
              <h3 className='text-2xl font-heading mb-2 text-white'>
                From the “{hotel.name}”
              </h3>

              {hotel.reviews.map((review) => (
                <Review key={review.id} review={review} isReported />
              ))}
            </div>
          ))}

          {i !== reportedReasons.length - 1 && <Separator className='my-6' />}
        </div>
      ))}
    </div>
  );
}
