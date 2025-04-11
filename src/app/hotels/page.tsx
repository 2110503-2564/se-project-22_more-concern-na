'use client'
import HotelCard from '@/components/HotelCard';
import React, { useEffect, useState } from 'react'
import { HotelResponse, IHotel } from '../../../interface';
import { getHotels } from '@/lib/hotelService';

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

  useEffect(() => {
    const fetchHotels = async () => {
      const responseData = await getHotels();
      setHotels(responseData);
    }
    fetchHotels();
  },[])

  return (
    <div className="
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    gap-6 
    p-4
    place-items-center
  ">
      {hotels.data.map((hotel:IHotel, index) => (
        <HotelCard key={index} type='view' hotel={hotel}/>
      ))}
    </div>
  )
}
