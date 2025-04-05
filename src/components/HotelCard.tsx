import { MapPin, Phone, Star } from 'lucide-react'
import React from 'react'

export default function HotelCard() {
  return (
    <div className='w-1/5 h-full bg-blue-500 rounded-lg'>
      <div className="rounded-t-lg h-44 bg-gray-600">
        <img
          src={"/img/hotel.jpg"}
          alt="hotel"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 h-56 relative">
        <div className="absolute top-2 right-2 px-2 py-1 flex items-center">
          <Star className="text-black" size={16} />
          <span className="ml-1 font-semibold text-gray-800">4.5</span>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-1">
          <span className="text-sm font-medium text-gray-800">124 reviews</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">name</h2>
        <div className="flex items-center mb-2">
          <MapPin />
          <span className="ml-2 font-medium">address</span>
        </div>
        <div className="flex items-center">
          <Phone />
          <span className="ml-2 font-medium">tel</span>
        </div>
      </div>
    </div>
  )
}
