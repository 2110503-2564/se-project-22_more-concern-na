import HotelCard from '@/components/HotelCard';
import React from 'react'

interface Room {
    roomType: string;
    picture?: string;
    capacity: number;
    maxCount: number;
    remainCount: number;
    price: number;
  }
  
  interface Hotel {
    _id: string;
    name: string;
    description?: string;
    picture?: string;
    buildingNumber: string;
    street: string;
    district: string;
    province: string;
    postalCode: string;
    tel: string;
    rooms: Room[];
    ratingSum: number;
    ratingCount: number;
  }

export default function Hotels() {
    const hotels: Hotel[] = [{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      },{
        _id: '123456789012',
        name: 'Hotel Sunshine Luxury Resort',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid doloremque laborum dolorum soluta nisi culpa nesciunt in ea accusantium, omnis optio veritatis, fugiat saepe nam similique itaque maxime repellat labore?',
        picture:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        buildingNumber: '123',
        street: 'Beachfront Boulevard',
        district: 'Coastal District',
        province: 'Paradise Province',
        postalCode: '10540',
        tel: '0123456789',
        rooms: [
          {
            roomType: 'Deluxe Ocean View',
            picture:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 5,
            remainCount: 3,
            price: 2150,
          },
          {
            roomType: 'Premium Suite',
            picture:
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 8,
            remainCount: 6,
            price: 3250,
          },
          {
            roomType: 'Executive Room',
            picture:
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            capacity: 2,
            maxCount: 10,
            remainCount: 7,
            price: 1750,
          },
          {
            roomType: 'Family Suite',
            picture:
              'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop',
            capacity: 4,
            maxCount: 4,
            remainCount: 2,
            price: 3950,
          },
        ],
        ratingSum: 1260,
        ratingCount: 280,
      }];
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
      {hotels.map((hotel, index) => (
        <HotelCard key={index} hotel={hotel}/>
      ))}
    </div>
  )
}
