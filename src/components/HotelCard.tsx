import React from 'react'

export default function HotelCard() {
  return (
    <div className='w-1/5 h-full bg-blue-500 rounded-lg'>
      <div className="relative rounded-t-lg h-44 bg-gray-600">
        <img
          src={"/img/hotel.jpg"}
          alt="hotel"
          className="w-full h-full object-cover"
        /> 
      </div>
      <div className="p-4 h-56">
        <h2 className="text-2xl font-semibold mb-2">name</h2>
        <div className="flex items-center mb-2">
          <span className="ml-2">address</span>
        </div>
        <div className="flex items-center">
          <span className="ml-2">tel</span>
        </div>
      </div>
    </div>
  )
}
