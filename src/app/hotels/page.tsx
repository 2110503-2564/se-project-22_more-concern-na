'use client'
import React, { useEffect, useState } from 'react'
import HotelCard from '@/components/HotelCard';
import { HotelResponse, IHotel } from '../../../interface';
import { getHotels } from '@/lib/hotelService';
import Loader from '@/components/Loader';

export default function Hotels() {
  const [hotels, setHotels] = useState<HotelResponse>({
    success: false,
    count: 0,
    data: [],
    pagination: {
      next: { page: 0, limit: 0 },
      prev: { page: 0, limit: 0 },
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      const responseData = await getHotels();
      setHotels(responseData);
      setIsLoading(false);
    };
    fetchHotels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-6 
        p-4
        place-items-center
      "
    >
      {hotels.data.map((hotel: IHotel, index) => (
        <HotelCard key={index} type="view" hotel={hotel} />
      ))}
    </div>
  );
}
