'use client';

import StatCard from '@/components/StatCard';
import { getUsers } from '@/lib/authService';
import { getBookings } from '@/lib/bookingService';
import { getHotels } from '@/lib/hotelService';
import {
  Building2,
  Calendar,
  CircleDollarSign,
  MessageSquareWarning,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hotelCount, setHotelCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [reportedReviewsCount, setReportedReviewsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch hotel data
      try {
        const hotelData = await getHotels();
        setHotelCount(hotelData.total || 0);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotelCount(0);
      }

      // Fetch booking, reported reviews, and users data
      if (token) {
        try {
          const bookingData = await getBookings(undefined, token);
          setBookingCount(bookingData.total || 0);
        } catch (bookingError) {
          console.error('Error fetching bookings:', bookingError);
          setBookingCount(0);
        }

        // waiting for report intregration produce
        // try {
        //   const reportedReviews = await getReportedReviews(token);
        //   setReportedReviewsCount(reportedReviews.count || 0);
        // } catch (reportError) {
        //   console.error('Error fetching reported reviews:', reportError);
        //   setReportedReviewsCount(0);
        // }

        try {
          const usersData = await getUsers(token);
          setUsersCount(usersData.total || 0);
        } catch (usersError) {
          console.error('Error fetching users:', usersError);
          setUsersCount(0);
        }
        setIsLoading(false);
      } else {
        console.warn(
          'No authentication token found. Authenticated data will not be loaded.',
        );
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  const handleManageHotels = () => {
    router.push('/manage/hotels');
  };

  const handleManageBookings = () => {
    router.push('/manage/bookings');
  };

  const handleManageReportedReviews = () => {
    router.push('/admin/report');
  };

  const handleManageUserRedemptionPoints = () => {
    router.push('/admin/redemption');
  };

  if(isLoading){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-60 py-8'>
      <div className='mb-8'>
        <h1 className='ml-6 text-5xl font-bold font-heading text-white'>
          Admin Dashboard
        </h1>
        <p className='text-gray-400 ml-6 p-2 font-detail text-2xl'>
          Manage hotels and bookings
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
        <StatCard
          icon={<Building2 size={32} className='text-white' />}
          title='Hotels'
          subtitle='manage hotel listings'
          count={hotelCount}
          countLabel='Total hotels in system'
          buttonText='Manage Hotels'
          onButtonClick={handleManageHotels}
        />

        <StatCard
          icon={<Calendar size={32} className='text-white' />}
          title='Bookings'
          subtitle='manage booking listings'
          count={bookingCount}
          countLabel='Total bookings in system'
          buttonText='Manage Bookings'
          onButtonClick={handleManageBookings}
        />

        <StatCard
          icon={<MessageSquareWarning size={32} className='text-white' />}
          title='Reported Reviews'
          subtitle='manage reported review listing'
          count={reportedReviewsCount}
          countLabel='Total reported reviews in system'
          buttonText='Manage Reported Reviews'
          onButtonClick={handleManageReportedReviews}
        />

        <StatCard
          icon={<CircleDollarSign size={32} className='text-white' />}
          title='Users'
          subtitle='manage user redemption points'
          count={usersCount}
          countLabel='Total users in system'
          buttonText='Manage Users'
          onButtonClick={handleManageUserRedemptionPoints}
        />
      </div>
    </div>
  );
}
