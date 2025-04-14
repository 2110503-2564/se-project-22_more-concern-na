'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import { HotelResponse, BookingResponse } from '../../../interface';
import { Building2, Calendar, MessageSquareWarning, CircleDollarSign } from 'lucide-react';
import { getHotels } from '@/lib/hotelService'; // Importing service methods
import { getBookings } from '@/lib/bookingService'; // Importing getBookings from bookingService

export default function DashboardPage() {
  const router = useRouter();

  // Define state variables to store the counts
  const [hotelCount, setHotelCount] = useState<number>(0);
  const [active, setActive] = useState<number>(0);  // Active bookings count
  const [upcoming, setUpcoming] = useState<number>(0);  // Upcoming bookings count
  const [past, setPast] = useState<number>(0);  // Past bookings count
  const [reportedReviewsCount, setReportedReviewsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0); // Users count (previously pointCount)

  // Function to fetch data
  const fetchDashboardData = async () => {
    try {
      // Fetching hotel data
      const hotelData: HotelResponse = await getHotels({ page: 1, limit: 10 });  // Adjust the params as needed
      setHotelCount(hotelData.count);  // Set hotel count

      // Fetching booking data using getBookings
      const bookingData: BookingResponse = await getBookings({ activePage: 1, activePageSize: 10 }); // Fetch bookings
      const activeBookings = bookingData.active?.data || [];
      const upcomingBookings = bookingData.upcoming?.data || [];
      const pastBookings = bookingData.past?.data || [];

      // Count bookings by status
      setActive(activeBookings.length);
      setUpcoming(upcomingBookings.length);
      setPast(pastBookings.length);

      // Placeholder data for reported reviews and users count
      setReportedReviewsCount(3);  // Placeholder for reported reviews count
      setUsersCount(100);  // Placeholder for users count

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);  // Empty dependency array to run this once on component mount

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
    router.push('/redemption');
  };

  return (
    <div className='container mx-auto px-60 py-8'>
      <div className="mb-8">
        <h1 className="ml-6 text-5xl font-bold font-heading text-white ">Admin Dashboard</h1>
        <p className="text-gray-400 ml-6 p-2 font-detail text-2xl">Manage hotels and bookings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <StatCard
          icon={<Building2 size={32} className="text-white" />}
          title="Hotels"
          subtitle="manage hotel listings"
          count={hotelCount}
          countLabel="Total hotels in system"
          buttonText="Manage Hotels"
          onButtonClick={handleManageHotels}
        />

        <StatCard
          icon={<Calendar size={32} className="text-white" />}
          title="Bookings"
          subtitle="manage booking listings"
          count={active + upcoming + past}  // Displaying total booking count (active + upcoming + past)
          countLabel="Total bookings in system"
          buttonText="Manage Bookings"
          onButtonClick={handleManageBookings}
        />

        <StatCard
          icon={<MessageSquareWarning size={32} className="text-white" />}
          title="Reported Reviews"
          subtitle="manage reported review listing"
          count={reportedReviewsCount}
          countLabel="Total reported reviews in system"
          buttonText="Manage Reported Reviews"
          onButtonClick={handleManageReportedReviews}
        />

        <StatCard
          icon={<CircleDollarSign size={32} className="text-white" />}
          title="Users"
          subtitle="manage user redemption points"
          count={usersCount}  // Changed from pointCount to usersCount
          countLabel="Total users in system"
          buttonText="Manage Users"
          onButtonClick={handleManageUserRedemptionPoints}
        />
      </div>
    </div>
  );
}
