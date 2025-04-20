'use client';

import Review from '@/components/Review';
import { Separator } from '@/components/ui/separator';
import { getAllReports, ignoreReport } from '@/lib/reportService';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AllReportResponse } from '../../../../interface';

export default function ManageReportedReviewsPage() {
  const [reportData, setReportData] = useState<AllReportResponse | undefined>();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReportedReviews = async () => {
      const res = await getAllReports((session as any)?.user?.token);
      setReportData(res);
    };
    fetchReportedReviews();
  }, []);

  const handleIgnore = async (ignore: boolean, reportId: string) => {
    const res = await ignoreReport(
      reportId,
      ignore,
      (session as any)?.user?.token,
    );
    if (res.success)
      toast.success(`Report ${ignore ? 'ignored' : 'unignored'}`);
  };
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

      {reportData?.reports.map((reasonBlock, i) => (
        <div key={i} className='mb-12 space-y-6'>
          <h2 className='text-4xl font-heading mb-2 text-white'>
            Report Reason {reasonBlock.reportReason}
          </h2>

          {reasonBlock.data.map((hotelBlock, j) => (
            <div key={j} className='bg-base-gd rounded-md p-4 space-y-4'>
              <h3 className='text-2xl font-heading mb-2 text-white'>
                From the “{hotelBlock.hotel}”
              </h3>

              {hotelBlock.report.map((report) => (
                <Review
                  key={report._id}
                  review={report.review}
                  isReported
                  handleIgnoreFromReport={(ignore) =>
                    handleIgnore(ignore, report._id)
                  }
                  ignore={report.isIgnore}
                />
              ))}
            </div>
          ))}

          {i !== reportData.reports.length - 1 && (
            <Separator className='my-6' />
          )}
        </div>
      ))}
    </div>
  );
}
