import React from 'react'
import { Button } from './ui/button'
import { BadgePercent } from 'lucide-react'

export default function RoomCard() {
  return (
    <div className="w-1/5 bg-purple-400 rounded-lg shadow overflow-hidden">
      <div className="relative h-44 bg-gray-600">
        <img
          src="/img/hotel.jpg"
          alt="hotel"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className='flex justify-between'>
            <h2 className="text-xl font-semibold text-gray-800">Room type</h2>
            <div className='text-right'>
                <p className="text-md font-medium text-gray-800">$150</p>
                <p className='text-md font-medium text-gray-800'>per night</p>
            </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Max 2 persons</p>
        </div>
        <div className="mt-4 flex justify-between">
            <p className="mt-3 text-sm text-gray-600">3 rooms available</p>
          <Button variant="default" className="bg-blue-600 ml-7 text-white text-sm px-8 py-2 rounded hover:bg-blue-700">
            book now
          </Button>
          <BadgePercent className='mt-2'/>
        </div>
      </div>
    </div>
  )
}
