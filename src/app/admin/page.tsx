"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import { HotelResponse, BookingResponse } from '../../../interface';
import { Building2, Calendar, MessageSquareWarning, CircleDollarSign } from 'lucide-react';

export default function DashboardPage({
  hotelCount = 14,
  bookingCount = 19,
  reportedReviewsCount = 3,
  usersCount = 4
}) {
  const router = useRouter();

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
          count={bookingCount}
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
          title="Points"
          subtitle="manage redemption point for user"
          count={usersCount}
          countLabel="Total users in system"
          buttonText="Manage User Redemption Point"
          onButtonClick={handleManageUserRedemptionPoints}
        />
      </div>
      </div>
  );
}