'use client';

import { useState, useEffect } from 'react';
import HotelCard from '@/components/HotelCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IHotel, HotelResponse } from '../../interface';
import { getHotels } from '@/lib/hotelService';
import Loader from '@/components/Loader';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [hotels, setHotels] = useState<HotelResponse>({
    success: false,
    total: 0,
    data: [],
    pagination: {
      next: { page: 0, limit: 0 },
      prev: { page: 0, limit: 0 },
    },
  });

  useEffect(() => {
    async function fetchHotels() {
      const res = await getHotels();
      setHotels(res);
      setLoading(false);
    }
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#0E1623] text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[450px] bg-cover bg-center" style={{ backgroundImage: `url('/img/cityscape.png')` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full px-4">
          {/* <div className="bg-[#0B1120] p-8 w-full max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-center mb-6">Find Your Hotel</h1>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <Input 
                placeholder="Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full md:w-64 rounded-md bg-[#0B1120] border border-white text-white"
              />
              <Input 
                placeholder="Date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full md:w-64 rounded-md bg-[#0B1120] border border-white text-white"
              />
              <Button size="lg" className="rounded-full shadow-lg" variant='golden'>SEARCH</Button>
            </div>
          </div> */}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#0E1623] to-transparent"></div>
      </div>

      {/* Why Choose MCN */}
      <div className="py-16 px-6 md:px-20">
        
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center space-x-4">
            <p className="text-5xl font-bold font-heading p-5">Why choose</p>
            <p className="text-5xl font-bold font-heading text-yellow-500">MCN</p>
          </div>
          <p className="text-gray-400 text-2xl max-w-2xl font-detail p-12">
            Experience a seamless booking process and enjoy premium accommodations tailored to your needs.
          </p>
        </div>

        <div className="bg-[#1F2937] p-20 flex flex-col md:flex-row gap-12">
          <img src="/img/luxury-hall.png" alt="luxury" className="w-full md:w-1/3 object-cover ml-20 mr-50" />
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-semibold font-heading mb-4">Curated Selection</h3>
            <p className="text-gray-400 text-2xl mb-6 font-detail">Handpicked hotels that meet our high standards for comfort and service.</p>

            <h3 className="text-3xl font-semibold font-heading mb-4">Flexible Booking</h3>
            <p className="text-gray-400 text-2xl mb-6 font-detail">Easy booking process with the ability to manage your reservations.</p>

            <h3 className="text-3xl font-semibold font-heading mb-4">Simple Discovery</h3>
            <p className="text-gray-400 text-2xl font-detail">Find the perfect hotel for your needs with our intuitive search system.</p>
          </div>
        </div>
      </div>

      {/* Our Best Hotel */}
      <div className="py-16 px-6 md:px-20 flex flex-col items-center">
        <h2 className="text-5xl font-heading font-bold mb-8">Our Best Hotel</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4 justify-center">
          {hotels.data.slice(0,3).map((hotel: IHotel, index) => (
            <div key={hotel._id} className="min-w-[280px]">
              <div className="text-5xl font-bold font-heading text-yellow-500 mb-2 text-center">
                {String(index + 1).padStart(2, '0')}
              </div>
              <HotelCard 
                hotel={hotel} 
                type="view" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}